
COMPILER = java -jar build/closure-compiler.jar
COMPILE_INPUT = --js flipsnap.js
COMPILE_OUTPUT = --js_output_file flipsnap.min.js

min:
	# compile minify file
	${COMPILER} ${COMPILE_INPUT} ${COMPILE_OUTPUT}

.PHONY: min
