const exec = require('child_process').exec;

export function writeLog(logContents: String) {
	let datetime = new Date()
	exec(`echo \"${datetime} -> ${logContents}\" >> ${__dirname.substring(0,__dirname.length-8)}/logs/syslogs.txt`)
}