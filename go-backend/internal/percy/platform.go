package percy

import "runtime"

func executableName() string {
	if runtime.GOOS == "windows" {
		return "percy.exe"
	}

	return "percy"
}