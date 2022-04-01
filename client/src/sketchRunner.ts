import * as os from "os"
import { ChildProcess, spawn } from 'child_process';
import { BufferedOutputChannel } from "./utils/outputBuffer";
import * as vscode from "vscode";

const fs = require('fs')
const path = require('path')

/**
 *  Responable for starting a compiled sketch
 */
export class SketchRunner implements vscode.Disposable {

	public static NAME: string = "Processing Sketch"; //Output channel name

	/**
	 * There should be only one instance of the SketchRunner class to avoid 
	 * running a sketch multiple times
	 * 
	 * @returns Instance of the SketchRunner class
	 */
	public static getInstance(): SketchRunner {
		if (SketchRunner._sketchrunner === null) {
			SketchRunner._sketchrunner = new SketchRunner();
		}
		return SketchRunner._sketchrunner
	}

	private static _sketchrunner: SketchRunner = null
	private _child: ChildProcess;
	private _workDir: string;
	private _compilePath: string;
	private _outputChannel: vscode.OutputChannel
	private _bufferedOutputChannel: BufferedOutputChannel;
	private _cpArg : string

	/**
	 * Setup the arguments for the childproces executing the sketch
	 * 
	 * @param processingCoreFile Path to the processing core.jar
	 * @param clientSketchPath Client side path to the compiled version of the sketch
	 * @param compilePath Server side path to the compiled version of the sketch
	 */
	public initilize(processingCoreFile: string, clientSketchPath: string, compilePath: string){
		this._workDir = clientSketchPath
		this._compilePath = compilePath
		this._outputChannel = vscode.window.createOutputChannel(SketchRunner.NAME);
        this._bufferedOutputChannel = new BufferedOutputChannel(this._outputChannel.append, 300);

		//The termination of the class path argument is OS dependend
		if (process.platform === 'win32') {
			this._cpArg = `${processingCoreFile};`
		}	
		else {
			this._cpArg = `${processingCoreFile}:`
		}
	}

	public get initialized(): boolean {
        return !!this._outputChannel;
    }

    public dispose() {
		if(this.isRunning) {
			return this.stop()
		}

        this._outputChannel.dispose();
        this._bufferedOutputChannel.dispose();
    }

	private get isRunning(): boolean {
		return this._child ? true : false;
	}
	
	/**
	 * Starts a sketch when non is running.
	 * 
	 * @returns Has the sketch started
	 */
	public async runSketch(): Promise<boolean>{
		if(this.isRunning) {
			this.stop();
			vscode.window.showWarningMessage(`Sketch is already running, stopping sketch.`, )
			return false
		}

		try {
			const result = await this.start();			
			return result
		}
		catch(error) {
			console.log(error)
			vscode.window.showErrorMessage(`Error occured while running sketch.!`);
			return false
		}
	}

	/**
	 * Stops a running sketch.
	 * 
	 * @returns Has the sketch stopped
	 */
	public async stopSketch(): Promise<boolean> {
		if(this.isRunning){
			const result = await this.stop()
			return result
		}
		else {
			return false
		}
	}

	/**
	 * Executes a copy(comes from the server) of the compiled sketch.
	 * The output is piped to the outputchannel.
	 * 
	 * @returns Exectution state
	 */
	private start(): Promise<boolean> {
		this.copyCompiledSketch(this._compilePath , this._workDir)

		this._bufferedOutputChannel.appendLine(`[Starting] Running processing sketch`);
		this._outputChannel.show(false)
		vscode.commands.executeCommand('setContext', 'processing.runningSketch', true)

		if (this.isRunning) {
			this.stop()
		}

		return new Promise((resolve, reject) => {

			// Setting the cwd in the child-process directly prevents issues where
			// the sketch and the client are not on the same drive.
			this._child = spawn(`java`,
				["-cp", `${this._cpArg}`, "ProcessingDefault"], {cwd: this._workDir})
	
			this._child.on("error", (err) => {
				reject(err)
			});

			this._child.on('close', (close) => {
				this.stop();
			});
	
			this._child.stdout.on("data", (data) => {
				if (this.isRunning) {
					this._bufferedOutputChannel.append(data.toString());
				}
			});
			resolve(true);
		})
	}

	/**
	 * Execution of the sketch is stopped. After which the child no longer exists.
	 * 
	 * @returns Stopping state
	 */
	private stop(): Promise<boolean> {

		vscode.commands.executeCommand('setContext', 'processing.runningSketch', false)

		return new Promise((resolve, reject) => {
		  if (!this.isRunning) {
			resolve(false);
			return;
		  }
		  try {
			if (this._bufferedOutputChannel) {
			  this._bufferedOutputChannel.appendLine(`[Done] Stopped the sketch ${os.EOL}`);
			}
			this._child.kill();
			this._child = null;
			resolve(true);
		  } catch (error) {
			  console.log(error)
			  reject(error);
		  }
		  });
	}
	
	/**
	 * Duplicates .class files from one place to the other.
	 * 
	 * @param src Path to the source. Directories are accepted.
	 * @param dest Path to the desination
	 */
	private copyCompiledSketch(src : string, dest : string) {

		var exists = fs.existsSync(src);
		var stats = exists && fs.statSync(src);
		var isDirectory = exists && stats.isDirectory();
		
		if (isDirectory) {
			if(!fs.existsSync(dest)) {
				  fs.mkdirSync(dest);
			}
			
			for (let i = 0; i < fs.readdirSync(src).length; i++) {
				const contents = fs.readdirSync(src)[i];
				this.copyCompiledSketch(path.join(src, contents),	path.join(dest, contents));
			}
	
		} else if (path.extname(src) === '.class'){
			fs.copyFileSync(src, dest);
	
		}
	
	  };
	
}