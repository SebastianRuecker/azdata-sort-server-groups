'use strict';

// necessary imports
import * as vscode from 'vscode';

// own imports
import {Environment} from './configs/environment';
import {state} from './configs/state';
import {OrderServerGroups} from './orderServerGroups';
import {Commands} from './enums/command.enum';

export function activate(context: vscode.ExtensionContext) {
    state.context = context;
    state.environment = new Environment();

    const order = new OrderServerGroups();
    context.subscriptions.push(vscode.commands.registerCommand(Commands.Sort, order.ProcessOrdering.bind(order)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.Restore, order.ProcessRestore.bind(order)));
}

export function deactivate() {
}
