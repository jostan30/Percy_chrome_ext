package percy

import (
	"bufio"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"io"
)

type Controller struct {
	binary    *Binary
	installer *Installer
	cmd       *exec.Cmd
	logs      chan string
}

func NewController(binary *Binary, installer *Installer) *Controller {
	return &Controller{
		binary:    binary,
		installer: installer,
		logs:      make(chan string, 100),
	}
}

func (c *Controller) Start(token string) error {
	log.Println("[percy] Start() called")
	log.Printf("[percy] executable: %s", c.binary.Path)

	if !c.binary.Exists() {
		return errors.New("percy cli not installed")
	}

	log.Println("[percy] Percy CLI exists")
	log.Println("[percy] launching: percy exec:start")

	c.cmd = exec.Command(c.binary.Path, "exec:start")

	c.cmd.Env = append(
		os.Environ(),
		"PERCY_TOKEN="+token,
		"PERCY_BRANCH=percy-local-manager",
	)

	stdout, err := c.cmd.StdoutPipe()
	if err != nil {
		return err
	}

	stderr, err := c.cmd.StderrPipe()
	if err != nil {
		return err
	}

	if err := c.cmd.Start(); err != nil {
		return fmt.Errorf("failed to start Percy CLI: %w", err)
	}

	log.Println("[percy] Percy process started")

	ready := make(chan error, 1)

	readOutput := func(r io.Reader) {
		scanner := bufio.NewScanner(r)

		for scanner.Scan() {
			line := scanner.Text()

			log.Printf("[percy-cli] %s", line)

			c.logs <- line

			if strings.Contains(line, "Percy has started") {
				log.Println("[percy] Percy is ready")

				select {
				case ready <- nil:
				default:
				}
			}
		}

		if err := scanner.Err(); err != nil {
			select {
			case ready <- err:
			default:
			}
		}
	}

	go readOutput(stdout)
	go readOutput(stderr)

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

func (c *Controller) EnsureReady() error {
	return c.installer.EnsureReady()
}