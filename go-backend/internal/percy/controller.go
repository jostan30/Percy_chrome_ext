package percy

import (
	"bufio"
	"errors"
	"os/exec"
	"strings"
)

type Controller struct {
	binary *Binary
}

func NewController() *Controller {
	return &Controller{
		binary: NewBinary(),
	}
}

func (c *Controller) Start(token string) error {

	if !c.binary.Exists() {
		return errors.New("percy cli not installed")
	}

	cmd := exec.Command(c.binary.Path ,"exec:start")

	cmd.Env = append(cmd.Env,
		"PERCY_TOKEN="+token,
		"PERCY_BRANCH=percy-local-manager",
	)

	stdout ,err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	if err := cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(stdout)

	for scanner.Scan() {
		line := scanner.Text()

		if strings.Contains(line, "Percy has started") {
			return nil
		}
	}

	return scanner.Err()
}