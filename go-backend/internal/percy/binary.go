package percy

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

type Binary struct {
	RuntimeDir string
	Path       string
}

func NewBinary() *Binary {
	exePath, err := os.Executable()
	if err != nil {
		panic(fmt.Sprintf("failed to determine server location: %v", err))
	}

	appDir := filepath.Dir(exePath)

	runtimeDir := filepath.Join(appDir, "runtime", "percy")

	percyPath := filepath.Join(
		runtimeDir,
		"node_modules",
		".bin",
		executableName(),
	)

	return &Binary{
		RuntimeDir: runtimeDir,
		Path:       percyPath,
	}
}

func (b *Binary) Exists() bool {
	_, err := os.Stat(b.Path)
	return err == nil
}

func (b *Binary) NodeExists() bool {
	_, err := exec.LookPath("node")
	return err == nil
}

func (b *Binary) NpmExists() bool {
	_, err := exec.LookPath("npm")
	return err == nil
}