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

ace.define("ace/mode/gcode_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var GcodeHighlightRules = function() {

        var keywords = (
            "IF|DO|WHILE|ENDWHILE|CALL|ENDIF|SUB|ENDSUB|GOTO|REPEAT|ENDREPEAT|CALL"
            );

        var builtinConstants = (
            "PI"
            );

        var builtinFunctions = (
            "ATAN|ABS|ACOS|ASIN|SIN|COS|EXP|FIX|FUP|ROUND|LN|TAN"
            );
        var keywordMapper = this.createKeywordMapper({
            "support.function": builtinFunctions,
            "keyword": keywords,
            "constant.language": builtinConstants
        }, "identifier", true);

        this.$rules = {
            "start" : [ {
                token : "comment",
                regex : "\\(.*\\)"
            }, {
                token : "comment",           // block number
                regex : "([N])([0-9]+)"
            }, {
                token : "string",           // " string
                regex : "([G])([0-9]+\\.?[0-9]?)"
            }, {
                token : "string",           // ' string
                regex : "([M])([0-9]+\\.?[0-9]?)"
            }, {
                token : "constant.numeric", // float
                regex : "([-+]?([0-9]*\\.?[0-9]+\\.?))|(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"
            }, {
                token : keywordMapper,
                regex : "[A-Z]"
            }, {
                token : "keyword.operator",
                regex : "EQ|LT|GT|NE|GE|LE|OR|XOR"
            }, {
                token : "paren.lparen",
                regex : "[\\[]"
            }, {
                token : "paren.rparen",
                regex : "[\\]]"
            }, {
                token : "text",
                regex : "\\s+"
            } ]
        };
    };

    oop.inherits(GcodeHighlightRules, TextHighlightRules);

    exports.GcodeHighlightRules = GcodeHighlightRules;
});

ace.define("ace/mode/gcode",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/gcode_highlight_rules","ace/range"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var GcodeHighlightRules = require("./gcode_highlight_rules").GcodeHighlightRules;
    var Range = require("../range").Range;

    var Mode = function() {
        this.HighlightRules = GcodeHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/gcode";
    }).call(Mode.prototype);

    exports.Mode = Mode;

});
                (function() {
                    ace.require(["ace/mode/gcode"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            