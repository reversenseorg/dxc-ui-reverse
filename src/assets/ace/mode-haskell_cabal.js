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

ace.define("ace/mode/haskell_cabal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CabalHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "^\\s*--.*$"
            }, {
                token: ["keyword"],
                regex: /^(\s*\w.*?)(:(?:\s+|$))/
            }, {
                token : "constant.numeric", // float
                regex : /[\d_]+(?:(?:[\.\d_]*)?)/
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"
            }, {
                token : "markup.heading",
                regex : /^(\w.*)$/
            }
        ]};

};

oop.inherits(CabalHighlightRules, TextHighlightRules);

exports.CabalHighlightRules = CabalHighlightRules;
});

ace.define("ace/mode/folding/haskell_cabal",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
  this.isHeading = function (session,row) {
      var heading = "markup.heading";
      var token = session.getTokens(row)[0];
      return row==0 || (token && token.type.lastIndexOf(heading, 0) === 0);
  };

  this.getFoldWidget = function(session, foldStyle, row) {
      if (this.isHeading(session,row)){
        return "start";
      } else if (foldStyle === "markbeginend" && !(/^\s*$/.test(session.getLine(row)))){
        var maxRow = session.getLength();
        while (++row < maxRow) {
          if (!(/^\s*$/.test(session.getLine(row)))){
              break;
          }
        }
        if (row==maxRow || this.isHeading(session,row)){
          return "end";
        }
      }
      return "";
  };


  this.getFoldWidgetRange = function(session, foldStyle, row) {
      var line = session.getLine(row);
      var startColumn = line.length;
      var maxRow = session.getLength();
      var startRow = row;
      var endRow = row;
      if (this.isHeading(session,row)) {
          while (++row < maxRow) {
              if (this.isHeading(session,row)){
                row--;
                break;
              }
          }

          endRow = row;
          if (endRow > startRow) {
              while (endRow > startRow && /^\s*$/.test(session.getLine(endRow)))
                  endRow--;
          }

          if (endRow > startRow) {
              var endColumn = session.getLine(endRow).length;
              return new Range(startRow, startColumn, endRow, endColumn);
          }
      } else if (this.getFoldWidget(session, foldStyle, row)==="end"){
        var endRow = row;
        var endColumn = session.getLine(endRow).length;
        while (--row>=0){
          if (this.isHeading(session,row)){
            break;
          }
        }
        var line = session.getLine(row);
        var startColumn = line.length;
        return new Range(row, startColumn, endRow, endColumn);
      }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/haskell_cabal",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/haskell_cabal_highlight_rules","ace/mode/folding/haskell_cabal"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CabalHighlightRules = require("./haskell_cabal_highlight_rules").CabalHighlightRules;
var FoldMode = require("./folding/haskell_cabal").FoldMode;

var Mode = function() {
    this.HighlightRules = CabalHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = null;
    this.$id = "ace/mode/haskell_cabal";
}).call(Mode.prototype);

exports.Mode = Mode;
});
                (function() {
                    ace.require(["ace/mode/haskell_cabal"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            