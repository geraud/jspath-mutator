grammar JsonPath;

parseJsonPath: jsonPath EOF;

jsonPath
    : '$' accessSpec +
    ;

accessSpec
    : recursiveDescent
    | dotAccess
    | bracketAccess
    ;

dotAccess
    : '.' selector
    ;

bracketAccess
    : '[' bracketExpression ']'
    ;

recursiveDescent
    : '..'  selector
    ;

selector
    : '*'
    | Identifier
    ;

bracketExpression
    : fieldIndex
    | arraySlice
    | interpolation
    ;


interpolation
    : Interpolation
    ;

arraySlice
    : arraySection
    | simpleSection
    ;

arraySection
    : startSection=NumericIndex? ':' endSection=NumericIndex? (':' stepSection=NumericIndex) ?
    ;

simpleSection
    : startSection=NumericIndex ',' endSection=NumericIndex
    ;

fieldIndex
    : Identifier
    | NumericIndex
    ;

Interpolation   : '{' .*? '}' ;
Identifier      : IdentifierStart IdentifierChar * ;
NumericIndex    : [+-]? [0-9]+ ;
WS              : [ \t\r\n]+ -> skip;

// FIXME geraud: cover the allowed unicode ranges in Json
fragment IdentifierStart : [a-zA-Z_];
fragment IdentifierChar  : [a-zA-Z0-9_];
