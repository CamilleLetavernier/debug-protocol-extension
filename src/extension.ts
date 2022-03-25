import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposables: vscode.Disposable[] = [];

	disposables.push(
		vscode.commands.registerCommand('debug-protocol-extension.start', () => {		
			if (vscode.debug.activeDebugSession){
				printBreakpoints(vscode.debug.activeDebugSession);
			}
			
			vscode.debug.onDidStartDebugSession(debugSession => {
				printBreakpoints(debugSession);
			});

			vscode.debug.onDidChangeBreakpoints(_event => {
				if (vscode.debug.activeDebugSession){
					printBreakpoints(vscode.debug.activeDebugSession);
				}
			});
        })
	);

	context.subscriptions.push(...disposables);
}

function printBreakpoints(debugSession: vscode.DebugSession): void {
	console.log('All available breakpoint ids: ', vscode.debug.breakpoints.map(b => b.id));
	for (const bp of vscode.debug.breakpoints) {
		debugSession.getDebugProtocolBreakpoint(bp).then(dpBP => {
			if (dpBP){
				console.log('DebugProtocolBreakpoint: ', dpBP);
				const verified = (dpBP as any).verified;
				console.log('Verified: ', verified);
				console.log('Line: ', (dpBP as any).line);
				const source = (dpBP as any).source;
				console.log('Source: ', source);
				if (source){
					const uri = vscode.debug.asDebugSourceUri(source, debugSession);
					console.log('Debug source URI: ' + uri);
				}
			} else {
				console.log('Debug protocol breakpoint not defined: ' + bp.id);
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
