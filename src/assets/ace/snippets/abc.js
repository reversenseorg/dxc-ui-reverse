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

ace.define("ace/snippets/abc",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "\n\
snippet zupfnoter.print\n\
	%%%%hn.print {\"startpos\": ${1:pos_y}, \"t\":\"${2:title}\", \"v\":[${3:voices}], \"s\":[[${4:syncvoices}1,2]], \"f\":[${5:flowlines}],  \"sf\":[${6:subflowlines}], \"j\":[${7:jumplines}]}\n\
\n\
snippet zupfnoter.note\n\
	%%%%hn.note {\"pos\": [${1:pos_x},${2:pos_y}], \"text\": \"${3:text}\", \"style\": \"${4:style}\"}\n\
\n\
snippet zupfnoter.annotation\n\
	%%%%hn.annotation {\"id\": \"${1:id}\", \"pos\": [${2:pos}], \"text\": \"${3:text}\"}\n\
\n\
snippet zupfnoter.lyrics\n\
	%%%%hn.lyrics {\"pos\": [${1:x_pos},${2:y_pos}]}\n\
\n\
snippet zupfnoter.legend\n\
	%%%%hn.legend {\"pos\": [${1:x_pos},${2:y_pos}]}\n\
\n\
\n\
\n\
snippet zupfnoter.target\n\
	\"^:${1:target}\"\n\
\n\
snippet zupfnoter.goto\n\
	\"^@${1:target}@${2:distance}\"\n\
\n\
snippet zupfnoter.annotationref\n\
	\"^#${1:target}\"\n\
\n\
snippet zupfnoter.annotation\n\
	\"^!${1:text}@${2:x_offset},${3:y_offset}\"\n\
\n\
\n\
";
exports.scope = "abc";

});
                (function() {
                    ace.require(["ace/snippets/abc"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            