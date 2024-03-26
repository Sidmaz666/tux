const keyword_list = [
    "auto",
    "break",
    "case",
    "char",
    "const",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extern",
    "float",
    "for",
    "goto",
    "if",
    "int",
    "long",
    "register",
    "return",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "switch",
    "typedef",
    "union",
    "unsigned",
    "void",
    "volatile",
    "while",
    "Alignas",
    "Alignof",
    "Atomic",
    "Bool",
    "Complex",
    "Generic",
    "Imaginary",
    "Noreturn",
    "Static",
    "Thread",
    "assert",
    "inline",
    "local",
    "restrict",
    "abstract",
    "add",
    "alias",
    "as",
    "ascending",
    "async",
    "await",
    "base",
    "bool",
    "by",
    "byte",
    "catch",
    "checked",
    "class",
    "decimal",
    "delegate",
    "descending",
    "dynamic",
    "equals",
    "event",
    "explicit",
    "false",
    "finally",
    "fixed",
    "foreach",
    "from",
    "get",
    "global",
    "group",
    "implicit",
    "in",
    "interface",
    "internal",
    "into",
    "is",
    "join",
    "let",
    "lock",
    "nameof",
    "namespace",
    "new",
    "notnull",
    "null",
    "object",
    "on",
    "operator",
    "orderby",
    "out",
    "override",
    "params",
    "partial",
    "private",
    "protected",
    "public",
    "readonly",
    "ref",
    "remove",
    "sbyte",
    "sealed",
    "select",
    "set",
    "stackalloc",
    "string",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "uint",
    "ulong",
    "unchecked",
    "unmanaged",
    "unsafe",
    "ushort",
    "using",
    "value",
    "var",
    "virtual",
    "when",
    "where",
    "yield",
    "and",
    "asm",
    "bitand",
    "bitor",
    "cast",
    "compl",
    "delete",
    "eq",
    "export",
    "friend",
    "mutable",
    "not",
    "or",
    "reinterpret",
    "t",
    "template",
    "typeid",
    "typename",
    "wchar",
    "xor",
    "alignas",
    "alignof",
    "constexpr",
    "decltype",
    "noexcept",
    "nullptr",
    "thread",
    "co",
    "concept",
    "consteval",
    "constinit",
    "requires",
    "extends",
    "final",
    "rethrow",
    "super",
    "with",
    "after",
    "end",
    "fn",
    "nil",
    "rescue",
    "andalso",
    "band",
    "begin",
    "bnot",
    "bor",
    "bsl",
    "bsr",
    "bxor",
    "cond",
    "div",
    "fun",
    "of",
    "orelse",
    "receive",
    "rem",
    "all",
    "allocatable",
    "allocate",
    "assign",
    "associate",
    "asynchronous",
    "backspace",
    "bind",
    "block",
    "call",
    "close",
    "codimension",
    "common",
    "concurrent",
    "contains",
    "contiguous",
    "critical",
    "cycle",
    "data",
    "deallocate",
    "deferred",
    "dimension",
    "elemental",
    "elsewhere",
    "endfile",
    "endif",
    "entry",
    "enumerator",
    "equivalence",
    "error",
    "exit",
    "external",
    "flush",
    "forall",
    "format",
    "function",
    "generic",
    "images",
    "import",
    "include",
    "inquire",
    "intent",
    "intrinsic",
    "memory",
    "module",
    "namelist",
    "non",
    "nopass",
    "nullify",
    "only",
    "open",
    "optional",
    "overridable",
    "parameter",
    "pass",
    "pause",
    "pointer",
    "print",
    "procedure",
    "program",
    "pure",
    "read",
    "recursive",
    "result",
    "rewind",
    "rewrite",
    "save",
    "sequence",
    "stop",
    "submodule",
    "subroutine",
    "sync",
    "target",
    "then",
    "unlock",
    "use",
    "wait",
    "write",
    "chan",
    "defer",
    "fallthrough",
    "func",
    "go",
    "map",
    "package",
    "range",
    "type",
    "boolean",
    "implements",
    "instanceof",
    "native",
    "strictfp",
    "synchronized",
    "throws",
    "transient",
    "exports",
    "opens",
    "permits",
    "provides",
    "record",
    "to",
    "transitive",
    "uses",
    "debugger",
    "actual",
    "annotation",
    "companion",
    "constructor",
    "crossinline",
    "expect",
    "field",
    "file",
    "infix",
    "init",
    "inner",
    "it",
    "lateinit",
    "noinline",
    "param",
    "property",
    "receiver",
    "reified",
    "setparam",
    "suspend",
    "tailrec",
    "typealias",
    "val",
    "vararg",
    "elseif",
    "repeat",
    "until",
    "classdef",
    "otherwise",
    "parfor",
    "persistent",
    "spmd",
    "BOOL",
    "Class",
    "IMP",
    "In",
    "NO",
    "Nil",
    "SEL",
    "YES",
    "autoreleasepool",
    "autoreleasing",
    "bycopy",
    "byref",
    "cmd",
    "encode",
    "id",
    "implementation",
    "inout",
    "oneway",
    "protocol",
    "required",
    "selector",
    "self",
    "strong",
    "synthesize",
    "unretained",
    "weak",
    "array",
    "callable",
    "clone",
    "compiler",
    "declare",
    "die",
    "echo",
    "empty",
    "enddeclare",
    "endfor",
    "endforeach",
    "endswitch",
    "endwhile",
    "eval",
    "halt",
    "insteadof",
    "isset",
    "list",
    "once",
    "require",
    "trait",
    "unset",
    "def",
    "del",
    "elif",
    "except",
    "exec",
    "lambda",
    "raise",
    "False",
    "None",
    "True",
    "match",
    "nonlocal",
    "FALSE",
    "Inf",
    "NA",
    "NULL",
    "NaN",
    "TRUE",
    "character",
    "complex",
    "integer",
    "next",
    "real",
    "BEGIN",
    "ENCODING",
    "END",
    "FILE",
    "LINE",
    "defined",
    "elsif",
    "ensure",
    "redo",
    "retry",
    "undef",
    "unless",
    "Self",
    "become",
    "box",
    "crate",
    "dyn",
    "impl",
    "loop",
    "macro",
    "mod",
    "move",
    "mut",
    "priv",
    "pub",
    "unsized",
    "forSome",
    "lazy",
    "Any",
    "Protocol",
    "Type",
    "associatedtype",
    "associativity",
    "available",
    "colorLiteral",
    "column",
    "convenience",
    "deinit",
    "didSet",
    "extension",
    "fileLiteral",
    "filePath",
    "fileprivate",
    "guard",
    "imageLiteral",
    "indirect",
    "left",
    "line",
    "mutating",
    "none",
    "nonmutating",
    "postfix",
    "precedence",
    "prefix",
    "rethrows",
    "right",
    "sourceLocation",
    "subscript",
    "unowned",
    "warning",
    "willSet",
    "AddHandler",
    "AddressOf",
    "Aggregate",
    "Alias",
    "And",
    "AndAlso",
    "Ansi",
    "As",
    "Assembly",
    "Async",
    "Auto",
    "Await",
    "Binary",
    "Boolean",
    "By",
    "ByRef",
    "ByVal",
    "Byte",
    "CBool",
    "CByte",
    "CChar",
    "CDate",
    "CDbl",
    "CDec",
    "CInt",
    "CLng",
    "CObj",
    "CSByte",
    "CShort",
    "CSng",
    "CStr",
    "CType",
    "CUInt",
    "CULng",
    "CUShort",
    "Call",
    "Case",
    "Catch",
    "Char",
    "Compare",
    "Const",
    "Continue",
    "Custom",
    "Date",
    "Decimal",
    "Declare",
    "Default",
    "Delegate",
    "Dim",
    "DirectCast",
    "Distinct",
    "Do",
    "Double",
    "Each",
    "Else",
    "ElseIf",
    "End",
    "EndIf",
    "Enum",
    "Equals",
    "Erase",
    "Error",
    "Event",
    "Exit",
    "Explicit",
    "ExternalSource",
    "Finally",
    "For",
    "Friend",
    "From",
    "Function",
    "Get",
    "GetType",
    "GetXMLNamespace",
    "Global",
    "GoSub",
    "GoTo",
    "Group",
    "Handles",
    "If",
    "Implements",
    "Imports",
    "Inherits",
    "Integer",
    "Interface",
    "Into",
    "Is",
    "IsFalse",
    "IsNot",
    "IsTrue",
    "Iterator",
    "Join",
    "Key",
    "Let",
    "Lib",
    "Like",
    "Long",
    "Loop",
    "Me",
    "Mid",
    "Mod",
    "Module",
    "MustInherit",
    "MustOverride",
    "MyBase",
    "MyClass",
    "NameOf",
    "Namespace",
    "Narrowing",
    "New",
    "Next",
    "Not",
    "NotInheritable",
    "NotOverridable",
    "Nothnig",
    "Object",
    "Of",
    "Off",
    "On",
    "Operator",
    "Option",
    "Optional",
    "Or",
    "OrElse",
    "Order",
    "Out",
    "Overloads",
    "Overridable",
    "Overrides",
    "ParamArray",
    "Partial",
    "Preserve",
    "Private",
    "Property",
    "Protected",
    "Public",
    "REM",
    "RaiseEvent",
    "ReDim",
    "ReadOnly",
    "Region",
    "RemoveHandler",
    "Resume",
    "Return",
    "SByte",
    "Select",
    "Set",
    "Shadows",
    "Shared",
    "Short",
    "Single",
    "Skip",
    "Step",
    "Stop",
    "Strict",
    "String",
    "Structure",
    "Sub",
    "SyncLock",
    "Take",
    "Text",
    "Then",
    "Throw",
    "To",
    "Try",
    "TryCast",
    "TypeOf",
    "UInteger",
    "ULong",
    "UShort",
    "Unicode",
    "Until",
    "Using",
    "Variant",
    "Wend",
    "When",
    "Where",
    "While",
    "Widening",
    "With",
    "WithEvents",
    "WriteOnly",
    "Xor",
    "Yield",
    "document",
    "window",
    "console.log()",
]
