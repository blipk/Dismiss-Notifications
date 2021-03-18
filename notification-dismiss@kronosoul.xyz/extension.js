/*
 * Notification Dismiss extension for Gnome 3
 * This file is part of the Notification Dismiss Gnome Extension for Gnome 3
 * Copyright (C) 2021 A.D. - http://kronosoul.xyz
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Credits:
 * This extension was created by using the following gnome-shell extensions
 * as a learning resource:
 * - dash-to-panel@jderose9.github.com.v16.shell-extension
 * - clipboard-indicator@tudmotu.com
 * - workspaces-to-dock@passingthru67.gmail.com
 * - workspace-isolated-dash@n-yuki.v14.shell-extension
 * - historymanager-prefix-search@sustmidown.centrum.cz
 * - minimum-workspaces@philbot9.github.com.v9.shell-extension
 * - gsconnect@andyholmes.github.io
 * Many thanks to those great extensions.
 */

// External imports
const Main = imports.ui.main;
const ExtensionSystem = imports.ui.extensionSystem;
const { extensionUtils } = imports.misc;
const { Meta, GLib, Gio, Shell, St } = imports.gi;
const { messageList } = imports.ui;

// Internal imports
const Me = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata['gettext-domain']).gettext;
const { dev } = Me.imports;
scopeName = 'notification-dismiss'


function init() {
    extensionUtils.initTranslations();
    dev.log(scopeName+'.'+arguments.callee.name, "@@~|");
}

function enable() {
    try {
    dev.log(scopeName+'.'+arguments.callee.name, "~@@|");
    Me.injections = {}

    if (!Me.injections['messageList.Message._init'])
        Me.injections['messageList.Message._init'] = messageList.Message.prototype._init;

    messageList.Message.prototype._init = function(title, body) {
        Me.injections['messageList.Message._init'].call(this, title, body); // Call parent
        this.connect('button-press-event', (self, event) => {
            if (event.get_button() != 3) return;    // Don't action on right click, wait for the release below
        })
        this.connect('button-release-event', (self, event) => {
            if (self.rcmenu) return;
            if (event.get_button() == 3)    // Close on right click
                this.destroy()
        })
    };
    } catch(e) { dev.log(scopeName+'.'+arguments.callee.name, e); }
}
function disable() {
    try {
    dev.log(scopeName+'.'+arguments.callee.name, "!!~|");
    if (Me.injections['messageList.Message._init']) messageList.Message.prototype._init = Me.injections['messageList.Message._init'];

    dev.log(scopeName+'.'+arguments.callee.name, "~!!|"+'\r\n');
    } catch(e) { dev.log(scopeName+'.'+arguments.callee.name, e); }
}

// 3.0 API backward compatibility
function main() {
    init();
    enable();
}