package percy

import "runtime"

func executableName() string {
	if runtime.GOOS == "windows" {
		return "percy.cmd"
	}

	return "percy"
}