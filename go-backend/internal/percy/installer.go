package percy

import (
	"fmt"
	"os"
	"log"
	"os/exec"
	"path/filepath"
)

type Installer struct {
	binary *Binary
}

func NewInstaller(binary *Binary) *Installer {
	return &Installer{
		binary: binary,
	}
}

func (i *Installer) EnsureReady() error {
	log.Println("[percy] checking Node.js...")

	if !i.binary.NodeExists() {
		return fmt.Errorf(
			"Node.js is required to run Percy CLI. Install Node.js and try again. Example: brew install node",
		)
	}

	log.Println("[percy] Node.js found")

	log.Println("[percy] checking npm...")

	if !i.binary.NpmExists() {
		return fmt.Errorf(
			"npm is required to install Percy CLI. Install npm and try again",
		)
	}

	log.Println("[percy] npm found")
	log.Printf("[percy] runtime directory: %s", i.binary.RuntimeDir)

	if !i.binary.Exists() {
		log.Println("[percy] Percy CLI not installed")
		log.Println("[percy] installing @percy/cli@latest...")

		if err := i.install(); err != nil {
			return err
		}

		log.Println("[percy] Percy CLI installation completed")
		return nil
	}

	log.Println("[percy] Percy CLI already installed")
	log.Println("[percy] checking for latest version...")

	if err := i.update(); err != nil {
		return err
	}

	log.Println("[percy] Percy CLI is ready")

	return nil
}

func (i *Installer) checkDependencies() error {
	if !i.binary.NodeExists() {
		return fmt.Errorf(
			"Node.js is required to run Percy CLI. Install Node.js and try again. Example: brew install node",
		)
	}

	if !i.binary.NpmExists() {
		return fmt.Errorf(
			"npm is required to install Percy CLI. Install npm and try again",
		)
	}

	return nil
}

func (i *Installer) install() error {
	if err := os.MkdirAll(i.binary.RuntimeDir, 0o755); err != nil {
		return fmt.Errorf(
			"failed to create Percy runtime directory: %w",
			err,
		)
	}

	log.Printf(
		"[percy] initializing npm project in %s",
		i.binary.RuntimeDir,
	)

	initCmd := exec.Command("npm", "init", "-y")
	initCmd.Dir = i.binary.RuntimeDir

	initOutput, err := initCmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf(
			"failed to initialize Percy npm project: %w\n%s",
			err,
			string(initOutput),
		)
	}

	log.Printf("[percy] npm project initialized")

	log.Println("[percy] installing @percy/cli@latest...")

	installCmd := exec.Command(
		"npm",
		"install",
		"@percy/cli@latest",
	)

	installCmd.Dir = i.binary.RuntimeDir

	installOutput, err := installCmd.CombinedOutput()

	log.Printf("[percy] npm output:\n%s", string(installOutput))

	if err != nil {
		return fmt.Errorf(
			"failed to install Percy CLI: %w",
			err,
		)
	}

	if !i.binary.Exists() {
		return fmt.Errorf(
			"Percy CLI installation completed but the Percy executable was not found at %s",
			i.binary.Path,
		)
	}

	return nil
}

func (i *Installer) update() error {
	log.Println("[percy] checking/installing latest @percy/cli...")

	cmd := exec.Command(
		"npm",
		"install",
		"@percy/cli@latest",
	)

	cmd.Dir = i.binary.RuntimeDir

	output, err := cmd.CombinedOutput()

	log.Printf("[percy] npm output:\n%s", string(output))

	if err != nil {
		return fmt.Errorf(
			"failed to update Percy CLI: %w",
			err,
		)
	}

	return nil
}
func (i *Installer) PackageJSONExists() bool {
	path := filepath.Join(i.binary.RuntimeDir, "package.json")

	_, err := os.Stat(path)
	return err == nil
}