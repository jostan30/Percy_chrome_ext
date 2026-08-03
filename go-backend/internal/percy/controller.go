package percy

import (
	"bufio"
	"errors"
	"os/exec"
	"strings"
)

type Controller struct {
    binary *Binary
    cmd    *exec.Cmd

    logs chan string
}

func NewController(binary *Binary) *Controller {
	return &Controller{
		binary: binary,
		logs:   make(chan string, 100),
	}
}

func (c *Controller) Start(token string) error {

	if !c.binary.Exists() {
		return errors.New("percy cli not installed")
	}

	c.cmd = exec.Command(c.binary.Path, "exec:start")

	ready := make(chan error, 1)

	c.cmd.Env = append(c.cmd.Env,
		"PERCY_TOKEN="+token,
		"PERCY_BRANCH=percy-local-manager",
	)

	stdout ,err := c.cmd.StdoutPipe()
	if err != nil {
		return err
	}

	if err := c.cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(stdout)

	go func() {

		for scanner.Scan() {

			line := scanner.Text()

			c.logs <- line

			if strings.Contains(line, "Percy has started") {
				ready <- nil
			}
		}

		if err := scanner.Err(); err != nil {
			ready <- err
		}

	}()

	return <-ready
}

func (c *Controller) WaitFor(match string) error {

	for {

		line := <-c.logs

		if strings.Contains(line, match) {
			return nil
		}

	}

}

func (c *Controller) Stop() error {

	if !c.binary.Exists() {
		return errors.New("percy cli not installed")
	}

	cmd := exec.Command(c.binary.Path, "exec:stop")

	if err := cmd.Run(); err != nil {
		return err
	}

	c.cmd = nil

	return nil
}