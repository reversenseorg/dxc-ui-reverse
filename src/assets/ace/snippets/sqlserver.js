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

ace.define("ace/snippets/sqlserver",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# ISNULL\n\
snippet isnull\n\
	ISNULL(${1:check_expression}, ${2:replacement_value})\n\
# FORMAT\n\
snippet format\n\
	FORMAT(${1:value}, ${2:format})\n\
# CAST\n\
snippet cast\n\
	CAST(${1:expression} AS ${2:data_type})\n\
# CONVERT\n\
snippet convert\n\
	CONVERT(${1:data_type}, ${2:expression})\n\
# DATEPART\n\
snippet datepart\n\
	DATEPART(${1:datepart}, ${2:date})\n\
# DATEDIFF\n\
snippet datediff\n\
	DATEDIFF(${1:datepart}, ${2:startdate}, ${3:enddate})\n\
# DATEADD\n\
snippet dateadd\n\
	DATEADD(${1:datepart}, ${2:number}, ${3:date})\n\
# DATEFROMPARTS \n\
snippet datefromparts\n\
	DATEFROMPARTS(${1:year}, ${2:month}, ${3:day})\n\
# OBJECT_DEFINITION\n\
snippet objectdef\n\
	SELECT OBJECT_DEFINITION(OBJECT_ID('${1:sys.server_permissions /*object name*/}'))\n\
# STUFF XML\n\
snippet stuffxml\n\
	STUFF((SELECT ', ' + ${1:ColumnName}\n\
		FROM ${2:TableName}\n\
		WHERE ${3:WhereClause}\n\
		FOR XML PATH('')), 1, 1, '') AS ${4:Alias}\n\
	${5:/*https://msdn.microsoft.com/en-us/library/ms188043.aspx*/}\n\
# Create Procedure\n\
snippet createproc\n\
	-- =============================================\n\
	-- Author:		${1:Author}\n\
	-- Create date: ${2:Date}\n\
	-- Description:	${3:Description}\n\
	-- =============================================\n\
	CREATE PROCEDURE ${4:Procedure_Name}\n\
		${5:/*Add the parameters for the stored procedure here*/}\n\
	AS\n\
	BEGIN\n\
		-- SET NOCOUNT ON added to prevent extra result sets from interfering with SELECT statements.\n\
		SET NOCOUNT ON;\n\
		\n\
		${6:/*Add the T-SQL statements to compute the return value here*/}\n\
		\n\
	END\n\
	GO\n\
# Create Scalar Function\n\
snippet createfn\n\
	-- =============================================\n\
	-- Author:		${1:Author}\n\
	-- Create date: ${2:Date}\n\
	-- Description:	${3:Description}\n\
	-- =============================================\n\
	CREATE FUNCTION ${4:Scalar_Function_Name}\n\
		-- Add the parameters for the function here\n\
	RETURNS ${5:Function_Data_Type}\n\
	AS\n\
	BEGIN\n\
		DECLARE @Result ${5:Function_Data_Type}\n\
		\n\
		${6:/*Add the T-SQL statements to compute the return value here*/}\n\
		\n\
	END\n\
	GO";
exports.scope = "sqlserver";

});
                (function() {
                    ace.require(["ace/snippets/sqlserver"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            