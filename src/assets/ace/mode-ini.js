/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

ace.define("ace/mode/ini_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var escapeRe = "\\\\(?:[\\\\0abtrn;#=:]|x[a-fA-F\\d]{4})";

var IniHighlightRules = function() {
    this.$rules = {
        start: [{
            token: 'punctuation.definition.comment.ini',
            regex: '#.*',
            push_: [{
                token: 'comment.line.number-sign.ini',
                regex: '$|^',
                next: 'pop'
            }, {
                defaultToken: 'comment.line.number-sign.ini'
            }]
        }, {
            token: 'punctuation.definition.comment.ini',
            regex: ';.*',
            push_: [{
                token: 'comment.line.semicolon.ini',
                regex: '$|^',
                next: 'pop'
            }, {
                defaultToken: 'comment.line.semicolon.ini'
            }]
        }, {
            token: ['keyword.other.definition.ini', 'text', 'punctuation.separator.key-value.ini'],
            regex: '\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)'
        }, {
            token: ['punctuation.definition.entity.ini', 'constant.section.group-title.ini', 'punctuation.definition.entity.ini'],
            regex: '^(\\[)(.*?)(\\])'
        }, {
            token: 'punctuation.definition.string.begin.ini',
            regex: "'",
            push: [{
                token: 'punctuation.definition.string.end.ini',
                regex: "'",
                next: 'pop'
            }, {
                token: "constant.language.escape",
                regex: escapeRe
            }, {
                defaultToken: 'string.quoted.single.ini'
            }]
        }, {
            token: 'punctuation.definition.string.begin.ini',
            regex: '"',
            push: [{
                token: "constant.language.escape",
                regex: escapeRe
            }, {
                token: 'punctuation.definition.string.end.ini',
                regex: '"',
                next: 'pop'
            }, {
                defaultToken: 'string.quoted.double.ini'
            }]
        }]
    };

    this.normalizeRules();
};

IniHighlightRules.metaData = {
    fileTypes: ['ini', 'conf'],
    keyEquivalent: '^~I',
    name: 'Ini',
    scopeName: 'source.ini'
};


oop.inherits(IniHighlightRules, TextHighlightRules);

exports.IniHighlightRules = IniHighlightRules;
});

ace.define("ace/mode/folding/ini",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function() {
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/;

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var re = this.foldingStartMarker;
        var line = session.getLine(row);
        
        var m = line.match(re);
        
        if (!m) return;
        
        var startName = m[1] + ".";
        
        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            line = session.getLine(row);
            if (/^\s*$/.test(line))
                continue;
            m = line.match(re);
            if (m && m[1].lastIndexOf(startName, 0) !== 0)
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/ini",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/ini_highlight_rules","ace/mode/folding/ini"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var IniHighlightRules = require("./ini_highlight_rules").IniHighlightRules;
var FoldMode = require("./folding/ini").FoldMode;

var Mode = function() {
    this.HighlightRules = IniHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = ";";
    this.blockComment = null;
    this.$id = "ace/mode/ini";
}).call(Mode.prototype);

exports.Mode = Mode;
});
                (function() {
                    ace.require(["ace/mode/ini"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            