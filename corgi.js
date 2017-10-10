/**
 * Corgi - an HTML Preprocessor built for style and structure
 */
//

(function() {
    function makeCorgi(mantle) {

    return ({
        lexer: new (class extends mantle.lexer.Lexer {
            constructor() {
                super(
                    ['doctype'],
                    ['[',']','=',',','(',')'],
                    ['"'],
                    true,
                    true
                );
            }
            isValidVarChar(c) {
                return ((c >= 'a') && (c <= 'z') || ((c >= '0') && (c <= '9')) || (c === '-'));
            }
        })(),
        parser: new (class extends mantle.parser.Parser {
            constructor() {
                super();

                this.addRule(["Key_doctype","Identifier"], function(list, i) {
                    let {line,pos} = list[i];
                    return new mantle.parser.ExpressionSimple("Doctype", line, pos, list[i+1].value);
                });

                this.addRule(["Identifier","Sym_=","String"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("Attr", [list[i],list[i+2]]);
                });

                this.addRule(["Sym_[","Attr"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("AttrListPart", [list[i+1]]);
                });

                this.addRule(["AttrListPart","Sym_,","Attr"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("AttrListPart", [...list[i].value,list[i+2]]);
                });

                this.addRule(["AttrListPart","Sym_]"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("AttrList", list[i].value);
                });

                this.addRule(["Identifier","AttrList"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ElementIA", [list[i],list[i+1]]);
                });

                this.addRule(["String","Sym_)"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [list[i]]);
                });

                this.addRule(["Identifier","Children"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ElementIC", [list[i],list[i+1]]);
                });

                this.addRule(["ElementIA","Children"], function(list, i) {
                    const [a,b] = list[i].value;
                    return new mantle.parser.ExpressionContainer("ElementIAC", [a,b,list[i+1]]);
                });

                const ELEMENTS = ["ElementI","ElementIA","ElementIC","ElementIAC"];

                this.addRule([ELEMENTS,"Sym_)"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [list[i]]);
                });

                this.addRule([ELEMENTS,"ChildsPart"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [list[i],...list[i+1].value]);
                });

                this.addRule(["Sym_(","ChildsPart"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("Children", list[i+1].value);
                });

                this.addRule(["Identifier","ChildsPart"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [
                        new mantle.parser.ExpressionSimple("ElementI", 0, 0, list[i].value),
                        ...list[i+1].value
                    ]);
                });

                this.addRule(["Identifier","Sym_)"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [
                        new mantle.parser.ExpressionSimple("ElementI", 0, 0, list[i].value),
                        ...list[i+1].value
                    ]);
                });

                this.addRule(["String","ChildsPart"], function(list, i) {
                    return new mantle.parser.ExpressionContainer("ChildsPart", [list[i],...list[i+1].value]);
                });

                this.addRule(["Doctype",ELEMENTS], function(list, i) {
                    return new mantle.parser.ExpressionContainer("DocumentEmpty", [list[i],list[i+1]]);
                });

                this.addRule(["DocumentEmpty","Children"], function(list, i) {
                    const [a,b] = list[i].value;
                    const [c,d] = b.value;
                    return new mantle.parser.ExpressionContainer("Document", [
                        a,
                        new mantle.parser.ExpressionContainer("ElementIAC", [c,d,list[i+1]])
                    ]);
                });
            }
            isValidIdentifier(word) {
                return true;
            }
        })(),
        compileExpr: function(expr) {
            const {type,value,line,pos} = expr;
            let a,b,c,d;

            switch (type) {
                case 'DocumentEmpty':
                case 'Document':
                case 'Children': {
                    return (value.map((x) => { return this.compileExpr(x); }).join(''));
                }
                case 'Doctype': {
                    if (value === 'html') return (`<!doctype html>`);
                    console.warn(value);
                }
                case 'ElementIAC': {
                    [a,b,c] = value.map(this.compileExpr.bind(this));
                    return (`<${a}${b}>${c}</${a}>`);
                }
                case 'Identifier': {
                    return (value);
                }
                case 'AttrList': {
                    return (value.reduce((p,c) => { return p + ` ${this.compileExpr(c)}`; }, ''));
                }
                case 'Attr': {
                    [a,b] = value.map((x) => { return this.compileExpr(x); });
                    return (`${a}="${b}"`);
                }
                case 'String': {
                    return (value.substring(1, value.length - 1)).split(`\\"`).join(`"`);
                }
                case 'ElementIC': {
                    [a,b] = value.map(this.compileExpr.bind(this));
                    return (`<${a}>${b}</${a}>`);
                }
                case 'ElementIA': {
                    [a,b] = value.map(this.compileExpr.bind(this));
                    return (`<${a}${b}></${a}>`);
                }
                case 'ElementI': {
                    return (`<${value}></${value}>`);
                }
            }
        },
        compile: function(src) {
            return this.compileExpr(this.parser.parse(this.lexer.lex(src)));
        }
    });

    }

    if (typeof module !== 'undefined' && 'exports' in module) {
        module.exports = makeCorgi(require('mantle.js'));
    }
    else {
        this.corgi = makeCorgi(mantle);
    }
})();
