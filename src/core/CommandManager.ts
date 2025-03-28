// ./src/core/CommandManager.ts

import RetrospectAI from "main";

export class CommandManager {
    private plugin: RetrospectAI;

    constructor(plugin: RetrospectAI) {
        this.plugin = plugin;
    }

    registerCommands() {
        this.registerAnalyzeNoteCommand();
        this.registerWeeklyAnalysisCommand();
    }

    private registerAnalyzeNoteCommand() {
    }

    private registerWeeklyAnalysisCommand() {
    }
}