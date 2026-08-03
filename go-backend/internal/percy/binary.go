package percy

import (
	"os"
	"path/filepath"
)

type Binary struct {
	Path string
}

func NewBinary() *Binary {
	home ,_ := os.UserHomeDir()

	return &Binary{
		Path: filepath.Join(home, "percy", executableName()),
	}
}

func (b *Binary) Exists() bool {
	_, err := os.Stat(b.Path)
	return err == nil
}