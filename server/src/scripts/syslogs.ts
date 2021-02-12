const exec = require('child_process').exec

export async function writeLog(logContents: String) {
	let datetime = new Date()
	exec(`echo \"${datetime.toISOString().slice(0,22)} -> ${logContents}\" >> ${__dirname.substring(0,__dirname.length-8)}/logs/syslogs.txt`)
}