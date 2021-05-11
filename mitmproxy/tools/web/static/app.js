(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        var _react = require("react"), _react2 = _interopRequireDefault(_react), _reactDom = require("react-dom"),
            _redux = require("redux"), _reactRedux = require("react-redux"), _reduxThunk = require("redux-thunk"),
            _reduxThunk2 = _interopRequireDefault(_reduxThunk), _ProxyApp = require("./components/ProxyApp"),
            _ProxyApp2 = _interopRequireDefault(_ProxyApp), _index = require("./ducks/index"),
            _index2 = _interopRequireDefault(_index), _eventLog = require("./ducks/eventLog"),
            _urlState = require("./urlState"), _urlState2 = _interopRequireDefault(_urlState),
            _websocket = require("./backends/websocket"), _websocket2 = _interopRequireDefault(_websocket),
            _static = require("./backends/static"), _static2 = _interopRequireDefault(_static),
            _reduxLogger = require("redux-logger"), middlewares = [_reduxThunk2.default],
            store = (0, _redux.createStore)(_index2.default, _redux.applyMiddleware.apply(void 0, middlewares));
        (0, _urlState2.default)(store), MITMWEB_STATIC ? window.backend = new _static2.default(store) : window.backend = new _websocket2.default(store), window.addEventListener("error", function (e) {
            store.dispatch((0, _eventLog.add)(e))
        }), document.addEventListener("DOMContentLoaded", function () {
            (0, _reactDom.render)(_react2.default.createElement(_reactRedux.Provider, {store: store}, _react2.default.createElement(_ProxyApp2.default, null)), document.getElementById("mitmproxy"))
        });

    }, {
        "./backends/static": 2,
        "./backends/websocket": 3,
        "./components/ProxyApp": 42,
        "./ducks/eventLog": 55,
        "./ducks/index": 57,
        "./urlState": 69,
        "react": "react",
        "react-dom": "react-dom",
        "react-redux": "react-redux",
        "redux": "redux",
        "redux-logger": "redux-logger",
        "redux-thunk": "redux-thunk"
    }],
    2: [function (require, module, exports) {
        "use strict";

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }

            return function (t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(), _utils = require("../utils"), StaticBackend = function () {
            function e(t) {
                _classCallCheck(this, e), this.store = t, this.onOpen()
            }

            return _createClass(e, [{
                key: "onOpen", value: function () {
                    this.fetchData("flows"), this.fetchData("settings")
                }
            }, {
                key: "fetchData", value: function (e) {
                    var t = this;
                    (0, _utils.fetchApi)("./" + e).then(function (e) {
                        return e.json()
                    }).then(function (n) {
                        t.receive(e, n)
                    })
                }
            }, {
                key: "receive", value: function (e, t) {
                    var n = (e + "_RECEIVE").toUpperCase();
                    this.store.dispatch({type: n, cmd: "receive", resource: e, data: t})
                }
            }]), e
        }();
        exports.default = StaticBackend;

    }, {"../utils": 70}],
    3: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t.default = e, t
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _extends = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
                }
                return e
            }, _createClass = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var o = t[n];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, n, o) {
                    return n && e(t.prototype, n), o && e(t, o), t
                }
            }(), _utils = require("../utils"), _connection = require("../ducks/connection"),
            connectionActions = _interopRequireWildcard(_connection), CMD_RESET = "reset",
            WebsocketBackend = function () {
                function e(t) {
                    _classCallCheck(this, e), this.activeFetches = {}, this.store = t, this.connect()
                }

                return _createClass(e, [{
                    key: "connect", value: function () {
                        var e = this;
                        this.socket = new WebSocket(location.origin.replace("http", "ws") + "/updates"), this.socket.addEventListener("open", function () {
                            return e.onOpen()
                        }), this.socket.addEventListener("close", function (t) {
                            return e.onClose(t)
                        }), this.socket.addEventListener("message", function (t) {
                            return e.onMessage(JSON.parse(t.data))
                        }), this.socket.addEventListener("error", function (t) {
                            return e.onError(t)
                        })
                    }
                }, {
                    key: "onOpen", value: function () {
                        this.fetchData("settings"), this.fetchData("flows"), this.fetchData("events"), this.fetchData("options"), this.store.dispatch(connectionActions.startFetching())
                    }
                }, {
                    key: "fetchData", value: function (e) {
                        var t = this, n = [];
                        this.activeFetches[e] = n, (0, _utils.fetchApi)("./" + e).then(function (e) {
                            return e.json()
                        }).then(function (o) {
                            t.activeFetches[e] === n && t.receive(e, o)
                        })
                    }
                }, {
                    key: "onMessage", value: function (e) {
                        if (e.cmd === CMD_RESET) return this.fetchData(e.resource);
                        if (e.resource in this.activeFetches) this.activeFetches[e.resource].push(e); else {
                            var t = (e.resource + "_" + e.cmd).toUpperCase();
                            this.store.dispatch(_extends({type: t}, e))
                        }
                    }
                }, {
                    key: "receive", value: function (e, t) {
                        var n = this, o = (e + "_RECEIVE").toUpperCase();
                        this.store.dispatch({type: o, cmd: "receive", resource: e, data: t});
                        var c = this.activeFetches[e];
                        delete this.activeFetches[e], c.forEach(function (e) {
                            return n.onMessage(e)
                        }), 0 === Object.keys(this.activeFetches).length && this.store.dispatch(connectionActions.connectionEstablished())
                    }
                }, {
                    key: "onClose", value: function (e) {
                        this.store.dispatch(connectionActions.connectionError("Connection closed at " + (new Date).toUTCString() + " with error code " + e.code + ".")), console.error("websocket connection closed", e)
                    }
                }, {
                    key: "onError", value: function () {
                        console.error("websocket connection errored", arguments)
                    }
                }]), e
            }();
        exports.default = WebsocketBackend;

    }, {"../ducks/connection": 54, "../utils": 70}],
    4: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ContentView(e) {
            var t = e.flow, n = e.message, r = e.contentView, o = e.isDisplayLarge, i = e.displayLarge,
                a = e.onContentChange, u = e.readonly;
            if (0 === n.contentLength && u) return _react2.default.createElement(MetaViews.ContentEmpty, e);
            if (null === n.contentLength && u) return _react2.default.createElement(MetaViews.ContentMissing, e);
            if (!o && ContentView.isContentTooLarge(n)) return _react2.default.createElement(MetaViews.ContentTooLarge, _extends({}, e, {onClick: i}));
            var l = void 0;
            return l = "Edit" === r ? _react2.default.createElement(_ContentViews.Edit, {
                flow: t,
                message: n,
                onChange: a
            }) : _react2.default.createElement(_ContentViews.ViewServer, {
                flow: t,
                message: n,
                contentView: r
            }), _react2.default.createElement("div", {className: "contentview"}, l, _react2.default.createElement(_ShowFullContentButton2.default, null))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _extends = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                }
                return e
            }, _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _ContentViews = require("./ContentView/ContentViews"), _MetaViews = require("./ContentView/MetaViews"),
            MetaViews = _interopRequireWildcard(_MetaViews),
            _ShowFullContentButton = require("./ContentView/ShowFullContentButton"),
            _ShowFullContentButton2 = _interopRequireDefault(_ShowFullContentButton),
            _flow = require("../ducks/ui/flow");
        ContentView.propTypes = {
            flow: _propTypes2.default.object.isRequired,
            message: _propTypes2.default.object.isRequired
        }, ContentView.isContentTooLarge = function (e) {
            return e.contentLength > 1048576 * (_ContentViews.ViewImage.matches(e) ? 10 : .2)
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {contentView: e.ui.flow.contentView, isDisplayLarge: e.ui.flow.displayLarge}
        }, {displayLarge: _flow.displayLarge, updateEdit: _flow.updateEdit})(ContentView);

    }, {
        "../ducks/ui/flow": 60,
        "./ContentView/ContentViews": 8,
        "./ContentView/MetaViews": 10,
        "./ContentView/ShowFullContentButton": 11,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    5: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function CodeEditor(e) {
            var r = e.content, t = e.onChange;
            return _react2.default.createElement("div", {
                className: "codeeditor", onKeyDown: function (e) {
                    return e.stopPropagation()
                }
            }, _react2.default.createElement(_reactCodemirror2.default, {
                value: r,
                onChange: t,
                options: {lineNumbers: !0}
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = CodeEditor;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactCodemirror = require("react-codemirror"),
            _reactCodemirror2 = _interopRequireDefault(_reactCodemirror);
        CodeEditor.propTypes = {
            content: _propTypes2.default.string.isRequired,
            onChange: _propTypes2.default.func.isRequired
        };

    }, {"prop-types": "prop-types", "react": "react", "react-codemirror": "react-codemirror"}],
    6: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function withContentLoader(e) {
            var t, n;
            return n = t = function (t) {
                function n(e) {
                    _classCallCheck(this, n);
                    var t = _possibleConstructorReturn(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this, e));
                    return t.state = {content: void 0, request: void 0}, t
                }

                return _inherits(n, _react2.default.Component), _createClass(n, [{
                    key: "componentWillMount",
                    value: function () {
                        this.updateContent(this.props)
                    }
                }, {
                    key: "componentWillReceiveProps", value: function (e) {
                        e.message.content === this.props.message.content && e.message.contentHash === this.props.message.contentHash && e.contentView === this.props.contentView || this.updateContent(e)
                    }
                }, {
                    key: "componentWillUnmount", value: function () {
                        this.state.request && this.state.request.abort()
                    }
                }, {
                    key: "updateContent", value: function (e) {
                        if (this.state.request && this.state.request.abort(), void 0 !== e.message.content) return this.setState({
                            request: void 0,
                            content: e.message.content
                        });
                        if (0 === e.message.contentLength || null === e.message.contentLength) return this.setState({
                            request: void 0,
                            content: ""
                        });
                        var t = _utils.MessageUtils.getContentURL(e.flow, e.message, e.contentView),
                            n = new XMLHttpRequest;
                        n.addEventListener("load", this.requestComplete.bind(this, n)), n.addEventListener("error", this.requestFailed.bind(this, n)), n.open("GET", t), n.send(), this.setState({
                            request: n,
                            content: void 0
                        })
                    }
                }, {
                    key: "requestComplete", value: function (e, t) {
                        e === this.state.request && this.setState({content: e.responseText, request: void 0})
                    }
                }, {
                    key: "requestFailed", value: function (e, t) {
                        e === this.state.request && (console.error(t), this.setState({
                            content: "Error getting content.",
                            request: void 0
                        }))
                    }
                }, {
                    key: "render", value: function () {
                        return void 0 !== this.state.content ? _react2.default.createElement(e, _extends({content: this.state.content}, this.props)) : _react2.default.createElement("div", {className: "text-center"}, _react2.default.createElement("i", {className: "fa fa-spinner fa-spin"}))
                    }
                }]), n
            }(), t.displayName = e.displayName || e.name, t.matches = e.matches, t.propTypes = _extends({}, e.propTypes, {
                content: _propTypes2.default.string,
                flow: _propTypes2.default.object.isRequired,
                message: _propTypes2.default.object.isRequired
            }), n
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }, _createClass = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }();
        exports.default = withContentLoader;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _utils = require("../../flow/utils.js");

    }, {"../../flow/utils.js": 68, "prop-types": "prop-types", "react": "react"}],
    7: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ContentViewOptions(e) {
            var t = e.flow, o = e.message, n = e.uploadContent, r = e.readonly, a = e.contentViewDescription;
            return _react2.default.createElement("div", {className: "view-options"}, r ? _react2.default.createElement(_ViewSelector2.default, {message: o}) : _react2.default.createElement("span", null, _react2.default.createElement("b", null, "View:"), " edit"), " ", _react2.default.createElement(_DownloadContentButton2.default, {
                flow: t,
                message: o
            }), " ", !r && _react2.default.createElement(_UploadContentButton2.default, {uploadContent: n}), " ", r && _react2.default.createElement("span", null, a))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _ViewSelector = require("./ViewSelector"), _ViewSelector2 = _interopRequireDefault(_ViewSelector),
            _UploadContentButton = require("./UploadContentButton"),
            _UploadContentButton2 = _interopRequireDefault(_UploadContentButton),
            _DownloadContentButton = require("./DownloadContentButton"),
            _DownloadContentButton2 = _interopRequireDefault(_DownloadContentButton);
        ContentViewOptions.propTypes = {
            flow: _propTypes2.default.object.isRequired,
            message: _propTypes2.default.object.isRequired
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {contentViewDescription: e.ui.flow.viewDescription, readonly: !e.ui.flow.modifiedFlow}
        })(ContentViewOptions);

    }, {
        "./DownloadContentButton": 9,
        "./UploadContentButton": 12,
        "./ViewSelector": 13,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    8: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function ViewImage(e) {
            var t = e.flow, r = e.message;
            return _react2.default.createElement("div", {className: "flowview-image"}, _react2.default.createElement("img", {
                src: _utils.MessageUtils.getContentURL(t, r),
                alt: "preview",
                className: "img-thumbnail"
            }))
        }

        function Edit(e) {
            var t = e.content, r = e.onChange;
            return _react2.default.createElement(_CodeEditor2.default, {content: t, onChange: r})
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.ViewImage = exports.ViewServer = exports.Edit = exports.PureViewServer = void 0;
        var _slicedToArray = function () {
                function e(e, t) {
                    var r = [], n = !0, o = !1, i = void 0;
                    try {
                        for (var a, s = e[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !t || r.length !== t); n = !0) ;
                    } catch (e) {
                        o = !0, i = e
                    } finally {
                        try {
                            !n && s.return && s.return()
                        } finally {
                            if (o) throw i
                        }
                    }
                    return r
                }

                return function (t, r) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, r);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(), _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _flow = require("../../ducks/ui/flow"), _ContentLoader = require("./ContentLoader"),
            _ContentLoader2 = _interopRequireDefault(_ContentLoader), _utils = require("../../flow/utils"),
            _CodeEditor = require("./CodeEditor"), _CodeEditor2 = _interopRequireDefault(_CodeEditor),
            isImage = /^image\/(png|jpe?g|gif|webp|vnc.microsoft.icon|x-icon)$/i;
        ViewImage.matches = function (e) {
            return isImage.test(_utils.MessageUtils.getContentType(e))
        }, ViewImage.propTypes = {
            flow: _propTypes2.default.object.isRequired,
            message: _propTypes2.default.object.isRequired
        }, Edit.propTypes = {content: _propTypes2.default.string.isRequired}, exports.Edit = Edit = (0, _ContentLoader2.default)(Edit);
        var PureViewServer = exports.PureViewServer = function (e) {
            function t() {
                return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }

            return _inherits(t, _react.Component), _createClass(t, [{
                key: "componentWillMount", value: function () {
                    this.setContentView(this.props)
                }
            }, {
                key: "componentWillReceiveProps", value: function (e) {
                    e.content != this.props.content && this.setContentView(e)
                }
            }, {
                key: "setContentView", value: function (e) {
                    try {
                        this.data = JSON.parse(e.content)
                    } catch (e) {
                        this.data = {lines: [], description: e.message}
                    }
                    e.setContentViewDescription(e.contentView != this.data.description ? this.data.description : ""), e.setContent(this.data.lines)
                }
            }, {
                key: "render", value: function () {
                    var e = this.props, t = (e.content, e.contentView, e.message), r = e.maxLines,
                        n = this.props.showFullContent ? this.data.lines : this.data.lines.slice(0, r);
                    return _react2.default.createElement("div", null, ViewImage.matches(t) && _react2.default.createElement(ViewImage, this.props), _react2.default.createElement("pre", null, n.map(function (e, t) {
                        return _react2.default.createElement("div", {key: "line" + t}, e.map(function (e, t) {
                            var r = _slicedToArray(e, 2), n = r[0], o = r[1];
                            return _react2.default.createElement("span", {key: "tuple" + t, className: n}, o)
                        }))
                    })))
                }
            }]), t
        }();
        PureViewServer.propTypes = {
            showFullContent: _propTypes2.default.bool.isRequired,
            maxLines: _propTypes2.default.number.isRequired,
            setContentViewDescription: _propTypes2.default.func.isRequired,
            setContent: _propTypes2.default.func.isRequired
        };
        var ViewServer = (0, _reactRedux.connect)(function (e) {
            return {showFullContent: e.ui.flow.showFullContent, maxLines: e.ui.flow.maxContentLines}
        }, {
            setContentViewDescription: _flow.setContentViewDescription,
            setContent: _flow.setContent
        })((0, _ContentLoader2.default)(PureViewServer));
        exports.Edit = Edit, exports.ViewServer = ViewServer, exports.ViewImage = ViewImage;

    }, {
        "../../ducks/ui/flow": 60,
        "../../flow/utils": 68,
        "./CodeEditor": 5,
        "./ContentLoader": 6,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    9: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function DownloadContentButton(e) {
            var t = e.flow, o = e.message;
            return _react2.default.createElement("a", {
                className: "btn btn-default btn-xs",
                href: _utils.MessageUtils.getContentURL(t, o),
                title: "Download the content of the flow."
            }, _react2.default.createElement("i", {className: "fa fa-download"}))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = DownloadContentButton;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _utils = require("../../flow/utils"),
            _propTypes = require("prop-types"), _propTypes2 = _interopRequireDefault(_propTypes);
        DownloadContentButton.propTypes = {
            flow: _propTypes2.default.object.isRequired,
            message: _propTypes2.default.object.isRequired
        };

    }, {"../../flow/utils": 68, "prop-types": "prop-types", "react": "react"}],
    10: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ContentEmpty(e) {
            var t = e.flow, n = e.message;
            return _react2.default.createElement("div", {className: "alert alert-info"}, "No ", t.request === n ? "request" : "response", " content.")
        }

        function ContentMissing(e) {
            var t = e.flow, n = e.message;
            return _react2.default.createElement("div", {className: "alert alert-info"}, t.request === n ? "Request" : "Response", " content missing.")
        }

        function ContentTooLarge(e) {
            var t = e.message, n = e.onClick, o = e.uploadContent, a = e.flow;
            return _react2.default.createElement("div", null, _react2.default.createElement("div", {className: "alert alert-warning"}, _react2.default.createElement("button", {
                onClick: n,
                className: "btn btn-xs btn-warning pull-right"
            }, "Display anyway"), (0, _utils.formatSize)(t.contentLength), " content size."), _react2.default.createElement("div", {className: "view-options text-center"}, _react2.default.createElement(_UploadContentButton2.default, {uploadContent: o}), " ", _react2.default.createElement(_DownloadContentButton2.default, {
                flow: a,
                message: t
            })))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.ContentEmpty = ContentEmpty, exports.ContentMissing = ContentMissing, exports.ContentTooLarge = ContentTooLarge;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _utils = require("../../utils.js"),
            _UploadContentButton = require("./UploadContentButton"),
            _UploadContentButton2 = _interopRequireDefault(_UploadContentButton),
            _DownloadContentButton = require("./DownloadContentButton"),
            _DownloadContentButton2 = _interopRequireDefault(_DownloadContentButton);

    }, {"../../utils.js": 70, "./DownloadContentButton": 9, "./UploadContentButton": 12, "react": "react"}],
    11: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ShowFullContentButton(e) {
            var t = e.setShowFullContent, n = e.showFullContent, o = e.visibleLines, u = e.contentLines;
            return !n && _react2.default.createElement("div", null, _react2.default.createElement(_Button2.default, {
                className: "view-all-content-btn btn-xs",
                onClick: function () {
                    return t()
                }
            }, "Show full content"), _react2.default.createElement("span", {className: "pull-right"}, " ", o, "/", u, " are visible   "))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.ShowFullContentButton = ShowFullContentButton;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _reactDom = require("react-dom"), _Button = require("../common/Button"),
            _Button2 = _interopRequireDefault(_Button), _flow = require("../../ducks/ui/flow");
        ShowFullContentButton.propTypes = {
            setShowFullContent: _propTypes2.default.func.isRequired,
            showFullContent: _propTypes2.default.bool.isRequired
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {
                showFullContent: e.ui.flow.showFullContent,
                visibleLines: e.ui.flow.maxContentLines,
                contentLines: e.ui.flow.content.length
            }
        }, {setShowFullContent: _flow.setShowFullContent})(ShowFullContentButton);

    }, {
        "../../ducks/ui/flow": 60,
        "../common/Button": 45,
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom",
        "react-redux": "react-redux"
    }],
    12: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function UploadContentButton(e) {
            var t = e.uploadContent;
            return _react2.default.createElement(_FileChooser2.default, {
                icon: "fa-upload",
                title: "Upload a file to replace the content.",
                onOpenFile: t,
                className: "btn btn-default btn-xs"
            })
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = UploadContentButton;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _FileChooser = require("../common/FileChooser"),
            _FileChooser2 = _interopRequireDefault(_FileChooser);
        UploadContentButton.propTypes = {uploadContent: _propTypes2.default.func.isRequired};

    }, {"../common/FileChooser": 48, "prop-types": "prop-types", "react": "react"}],
    13: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ViewSelector(e) {
            var t = e.contentViews, r = e.activeView, n = e.setContentView,
                o = _react2.default.createElement("span", null, " ", _react2.default.createElement("b", null, "View:"), " ", r.toLowerCase(), " ", _react2.default.createElement("span", {className: "caret"}), " ");
            return _react2.default.createElement(_Dropdown2.default, {
                dropup: !0,
                className: "pull-left",
                btnClass: "btn btn-default btn-xs",
                text: o
            }, t.map(function (e) {
                return _react2.default.createElement("a", {
                    href: "#", key: e, onClick: function (t) {
                        t.preventDefault(), n(e)
                    }
                }, e.toLowerCase().replace("_", " "))
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.ViewSelector = ViewSelector;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _flow = require("../../ducks/ui/flow"), _Dropdown = require("../common/Dropdown"),
            _Dropdown2 = _interopRequireDefault(_Dropdown);
        ViewSelector.propTypes = {
            contentViews: _propTypes2.default.array.isRequired,
            activeView: _propTypes2.default.string.isRequired,
            setContentView: _propTypes2.default.func.isRequired
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {contentViews: e.settings.contentViews, activeView: e.ui.flow.contentView}
        }, {setContentView: _flow.setContentView})(ViewSelector);

    }, {
        "../../ducks/ui/flow": 60,
        "../common/Dropdown": 47,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    14: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.PureEventLog = void 0;
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var o = t[r];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, r, o) {
                    return r && e(t.prototype, r), o && e(t, o), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _eventLog = require("../ducks/eventLog"), _ToggleButton = require("./common/ToggleButton"),
            _ToggleButton2 = _interopRequireDefault(_ToggleButton), _EventList = require("./EventLog/EventList"),
            _EventList2 = _interopRequireDefault(_EventList), PureEventLog = exports.PureEventLog = function (e) {
                function t(e, r) {
                    _classCallCheck(this, t);
                    var o = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return o.state = {height: o.props.defaultHeight}, o.onDragStart = o.onDragStart.bind(o), o.onDragMove = o.onDragMove.bind(o), o.onDragStop = o.onDragStop.bind(o), o
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "onDragStart", value: function (e) {
                        e.preventDefault(), this.dragStart = this.state.height + e.pageY, window.addEventListener("mousemove", this.onDragMove), window.addEventListener("mouseup", this.onDragStop), window.addEventListener("dragend", this.onDragStop)
                    }
                }, {
                    key: "onDragMove", value: function (e) {
                        e.preventDefault(), this.setState({height: this.dragStart - e.pageY})
                    }
                }, {
                    key: "onDragStop", value: function (e) {
                        e.preventDefault(), window.removeEventListener("mousemove", this.onDragMove)
                    }
                }, {
                    key: "render", value: function () {
                        var e = this.state.height, t = this.props, r = t.filters, o = t.events, n = t.toggleFilter,
                            a = t.close;
                        return _react2.default.createElement("div", {
                            className: "eventlog",
                            style: {height: e}
                        }, _react2.default.createElement("div", {onMouseDown: this.onDragStart}, "Eventlog", _react2.default.createElement("div", {className: "pull-right"}, ["debug", "info", "web", "warn", "error"].map(function (e) {
                            return _react2.default.createElement(_ToggleButton2.default, {
                                key: e,
                                text: e,
                                checked: r[e],
                                onToggle: function () {
                                    return n(e)
                                }
                            })
                        }), _react2.default.createElement("i", {
                            onClick: a,
                            className: "fa fa-close"
                        }))), _react2.default.createElement(_EventList2.default, {events: o}))
                    }
                }]), t
            }();
        PureEventLog.propTypes = {
            filters: _propTypes2.default.object.isRequired,
            events: _propTypes2.default.array.isRequired,
            toggleFilter: _propTypes2.default.func.isRequired,
            close: _propTypes2.default.func.isRequired,
            defaultHeight: _propTypes2.default.number
        }, PureEventLog.defaultProps = {defaultHeight: 200}, exports.default = (0, _reactRedux.connect)(function (e) {
            return {filters: e.eventLog.filters, events: e.eventLog.view}
        }, {close: _eventLog.toggleVisibility, toggleFilter: _eventLog.toggleFilter})(PureEventLog);

    }, {
        "../ducks/eventLog": 55,
        "./EventLog/EventList": 15,
        "./common/ToggleButton": 51,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    15: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function LogIcon(e) {
            var t = {web: "html5", debug: "bug", warn: "exclamation-triangle", error: "ban"}[e.event.level] || "info";
            return _react2.default.createElement("i", {className: "fa fa-fw fa-" + t})
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var o = t[r];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, r, o) {
                    return r && e(t.prototype, r), o && e(t, o), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), _shallowequal = require("shallowequal"),
            _shallowequal2 = _interopRequireDefault(_shallowequal), _AutoScroll = require("../helpers/AutoScroll"),
            _AutoScroll2 = _interopRequireDefault(_AutoScroll), _VirtualScroll = require("../helpers/VirtualScroll"),
            EventLogList = function (e) {
                function t(e) {
                    _classCallCheck(this, t);
                    var r = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.heights = {}, r.state = {vScroll: (0, _VirtualScroll.calcVScroll)()}, r.onViewportUpdate = r.onViewportUpdate.bind(r), r
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentDidMount", value: function () {
                        window.addEventListener("resize", this.onViewportUpdate), this.onViewportUpdate()
                    }
                }, {
                    key: "componentWillUnmount", value: function () {
                        window.removeEventListener("resize", this.onViewportUpdate)
                    }
                }, {
                    key: "componentDidUpdate", value: function () {
                        this.onViewportUpdate()
                    }
                }, {
                    key: "onViewportUpdate", value: function () {
                        var e = this, t = _reactDom2.default.findDOMNode(this), r = (0, _VirtualScroll.calcVScroll)({
                            itemCount: this.props.events.length,
                            rowHeight: this.props.rowHeight,
                            viewportTop: t.scrollTop,
                            viewportHeight: t.offsetHeight,
                            itemHeights: this.props.events.map(function (t) {
                                return e.heights[t.id]
                            })
                        });
                        (0, _shallowequal2.default)(this.state.vScroll, r) || this.setState({vScroll: r})
                    }
                }, {
                    key: "setHeight", value: function (e, t) {
                        if (t && !this.heights[e]) {
                            var r = t.offsetHeight;
                            this.heights[e] !== r && (this.heights[e] = r, this.onViewportUpdate())
                        }
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = this.state.vScroll, r = this.props.events;
                        return _react2.default.createElement("pre", {onScroll: this.onViewportUpdate}, _react2.default.createElement("div", {style: {height: t.paddingTop}}), r.slice(t.start, t.end).map(function (t) {
                            return _react2.default.createElement("div", {
                                key: t.id, ref: function (r) {
                                    return e.setHeight(t.id, r)
                                }
                            }, _react2.default.createElement(LogIcon, {event: t}), t.message)
                        }), _react2.default.createElement("div", {style: {height: t.paddingBottom}}))
                    }
                }]), t
            }();
        EventLogList.propTypes = {
            events: _propTypes2.default.array.isRequired,
            rowHeight: _propTypes2.default.number
        }, EventLogList.defaultProps = {rowHeight: 18}, exports.default = (0, _AutoScroll2.default)(EventLogList);

    }, {
        "../helpers/AutoScroll": 52,
        "../helpers/VirtualScroll": 53,
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom",
        "shallowequal": "shallowequal"
    }],
    16: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.PureFlowTable = void 0;
        var _createClass = function () {
                function e(e, t) {
                    for (var o = 0; o < t.length; o++) {
                        var l = t[o];
                        l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), Object.defineProperty(e, l.key, l)
                    }
                }

                return function (t, o, l) {
                    return o && e(t.prototype, o), l && e(t, l), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), _reactRedux = require("react-redux"),
            _shallowequal = require("shallowequal"), _shallowequal2 = _interopRequireDefault(_shallowequal),
            _AutoScroll = require("./helpers/AutoScroll"), _AutoScroll2 = _interopRequireDefault(_AutoScroll),
            _VirtualScroll = require("./helpers/VirtualScroll"), _FlowTableHead = require("./FlowTable/FlowTableHead"),
            _FlowTableHead2 = _interopRequireDefault(_FlowTableHead), _FlowRow = require("./FlowTable/FlowRow"),
            _FlowRow2 = _interopRequireDefault(_FlowRow), _filt = require("../filt/filt"),
            _filt2 = _interopRequireDefault(_filt), _flows = require("../ducks/flows"),
            flowsActions = _interopRequireWildcard(_flows), FlowTable = function (e) {
                function t(e, o) {
                    _classCallCheck(this, t);
                    var l = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, o));
                    return l.state = {vScroll: (0, _VirtualScroll.calcVScroll)()}, l.onViewportUpdate = l.onViewportUpdate.bind(l), l
                }

                return _inherits(t, _react2.default.Component), _createClass(t, [{
                    key: "componentWillMount",
                    value: function () {
                        window.addEventListener("resize", this.onViewportUpdate)
                    }
                }, {
                    key: "componentWillUnmount", value: function () {
                        window.removeEventListener("resize", this.onViewportUpdate)
                    }
                }, {
                    key: "componentDidUpdate", value: function () {
                        if (this.onViewportUpdate(), this.shouldScrollIntoView) {
                            this.shouldScrollIntoView = !1;
                            var e = this.props, t = e.rowHeight, o = e.flows, l = e.selected,
                                r = _reactDom2.default.findDOMNode(this),
                                i = _reactDom2.default.findDOMNode(this.refs.head), a = i ? i.offsetHeight : 0,
                                n = o.indexOf(l) * t + a, u = n + t, s = r.scrollTop, c = r.offsetHeight;
                            n - a < s ? r.scrollTop = n - a : u > s + c && (r.scrollTop = u - c)
                        }
                    }
                }, {
                    key: "componentWillReceiveProps", value: function (e) {
                        e.selected && e.selected !== this.props.selected && (this.shouldScrollIntoView = !0)
                    }
                }, {
                    key: "onViewportUpdate", value: function () {
                        var e = _reactDom2.default.findDOMNode(this), t = e.scrollTop, o = (0, _VirtualScroll.calcVScroll)({
                            viewportTop: t,
                            viewportHeight: e.offsetHeight,
                            itemCount: this.props.flows.length,
                            rowHeight: this.props.rowHeight
                        });
                        this.state.viewportTop === t && (0, _shallowequal2.default)(this.state.vScroll, o) || this.setState({
                            vScroll: o,
                            viewportTop: t
                        })
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = this.state, o = t.vScroll, l = t.viewportTop, r = this.props, i = r.flows,
                            a = r.selected, n = r.highlight, u = n ? _filt2.default.parse(n) : function () {
                                return !1
                            };
                        return _react2.default.createElement("div", {
                            className: "flow-table",
                            onScroll: this.onViewportUpdate
                        }, _react2.default.createElement("table", null, _react2.default.createElement("thead", {
                            ref: "head",
                            style: {transform: "translateY(" + l + "px)"}
                        }, _react2.default.createElement(_FlowTableHead2.default, null)), _react2.default.createElement("tbody", null, _react2.default.createElement("tr", {style: {height: o.paddingTop}}), i.slice(o.start, o.end).map(function (t) {
                            return _react2.default.createElement(_FlowRow2.default, {
                                key: t.id,
                                flow: t,
                                selected: t === a,
                                highlighted: u(t),
                                onSelect: e.props.selectFlow
                            })
                        }), _react2.default.createElement("tr", {style: {height: o.paddingBottom}}))))
                    }
                }]), t
            }();
        FlowTable.propTypes = {
            selectFlow: _propTypes2.default.func.isRequired,
            flows: _propTypes2.default.array.isRequired,
            rowHeight: _propTypes2.default.number,
            highlight: _propTypes2.default.string,
            selected: _propTypes2.default.object
        }, FlowTable.defaultProps = {rowHeight: 32};
        var PureFlowTable = exports.PureFlowTable = (0, _AutoScroll2.default)(FlowTable);
        exports.default = (0, _reactRedux.connect)(function (e) {
            return {flows: e.flows.view, highlight: e.flows.highlight, selected: e.flows.byId[e.flows.selected[0]]}
        }, {selectFlow: flowsActions.select})(PureFlowTable);

    }, {
        "../ducks/flows": 56,
        "../filt/filt": 67,
        "./FlowTable/FlowRow": 18,
        "./FlowTable/FlowTableHead": 19,
        "./helpers/AutoScroll": 52,
        "./helpers/VirtualScroll": 53,
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom",
        "react-redux": "react-redux",
        "shallowequal": "shallowequal"
    }],
    17: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function TLSColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: (0, _classnames2.default)("col-tls", "https" === t.request.scheme ? "col-tls-https" : "col-tls-http")})
        }

        function IconColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "col-icon"}, _react2.default.createElement("div", {className: (0, _classnames2.default)("resource-icon", IconColumn.getIcon(t))}))
        }

        function PathColumn(e) {
            var t = e.flow, s = void 0;
            return t.error && (s = "Connection killed." === t.error.msg ? _react2.default.createElement("i", {className: "fa fa-fw fa-times pull-right"}) : _react2.default.createElement("i", {className: "fa fa-fw fa-exclamation pull-right"})), _react2.default.createElement("td", {className: "col-path"}, t.request.is_replay && _react2.default.createElement("i", {className: "fa fa-fw fa-repeat pull-right"}), t.intercepted && _react2.default.createElement("i", {className: "fa fa-fw fa-pause pull-right"}), s, _utils.RequestUtils.pretty_url(t.request))
        }

        function MethodColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "col-method"}, t.request.method)
        }

        function InputColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "inputtype"},_react2.default.createElement("input", {className:"sendcase",type:"checkbox",Name:"changecase"}))
        }

        function StatusColumn(e) {
            var t = e.flow, s = "darkred";
            return t.response && 100 <= t.response.status_code && t.response.status_code < 200 ? s = "green" : t.response && 200 <= t.response.status_code && t.response.status_code < 300 ? s = "darkgreen" : t.response && 300 <= t.response.status_code && t.response.status_code < 400 ? s = "lightblue" : t.response && 400 <= t.response.status_code && t.response.status_code < 500 ? s = "lightred" : t.response && 500 <= t.response.status_code && t.response.status_code < 600 && (s = "lightred"), _react2.default.createElement("td", {
                className: "col-status",
                style: {color: s}
            }, t.response && t.response.status_code)
        }

        function SizeColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "col-size"}, (0, _utils2.formatSize)(SizeColumn.getTotalSize(t)))
        }

        function TimeColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "col-time"}, t.response ? (0, _utils2.formatTimeDelta)(1e3 * (t.response.timestamp_end - t.request.timestamp_start)) : "...")
        }

        function TimeStampColumn(e) {
            var t = e.flow;
            return _react2.default.createElement("td", {className: "col-start"}, t.request.timestamp_start ? (0, _utils2.formatTimeStamp)(t.request.timestamp_start) : "...")
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.defaultColumnNames = void 0, exports.TLSColumn = TLSColumn, exports.IconColumn = IconColumn,
            exports.PathColumn = PathColumn,
            exports.InputColumn=InputColumn,
            exports.MethodColumn = MethodColumn, exports.StatusColumn = StatusColumn, exports.SizeColumn = SizeColumn, exports.TimeColumn = TimeColumn, exports.TimeStampColumn = TimeStampColumn;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), _utils = require("../../flow/utils.js"),
            _utils2 = require("../../utils.js"),
            defaultColumnNames = exports.defaultColumnNames = ["tls", "icon", "path", "method", "status", "size", "time"];
        TLSColumn.headerClass = "col-tls", TLSColumn.headerName = "", IconColumn.headerClass = "col-icon", IconColumn.headerName = "", IconColumn.getIcon = function (e) {
            if (!e.response) return "resource-icon-plain";
            var t = _utils.ResponseUtils.getContentType(e.response) || "";
            return 304 === e.response.status_code ? "resource-icon-not-modified" : 300 <= e.response.status_code && e.response.status_code < 400 ? "resource-icon-redirect" : t.indexOf("image") >= 0 ? "resource-icon-image" : t.indexOf("javascript") >= 0 ? "resource-icon-js" : t.indexOf("css") >= 0 ? "resource-icon-css" : t.indexOf("html") >= 0 ? "resource-icon-document" : "resource-icon-plain"
        }, PathColumn.headerClass = "col-path", PathColumn.headerName = "Path",
            MethodColumn.headerClass = "col-method",
            InputColumn.headerClass="checkout",
            InputColumn.headerName="选择",MethodColumn.headerName = "Method", StatusColumn.headerClass = "col-status", StatusColumn.headerName = "Status", SizeColumn.getTotalSize = function (e) {
            var t = e.request.contentLength;
            return e.response && (t += e.response.contentLength || 0), t
        }, SizeColumn.headerClass = "col-size", SizeColumn.headerName = "Size", TimeColumn.headerClass = "col-time", TimeColumn.headerName = "Time", TimeStampColumn.headerClass = "col-timestamp", TimeStampColumn.headerName = "TimeStamp", exports.default = [TLSColumn, IconColumn, PathColumn, MethodColumn, StatusColumn, TimeStampColumn, SizeColumn, TimeColumn];

    }, {"../../flow/utils.js": 68, "../../utils.js": 70, "classnames": "classnames", "react": "react"}],
    18: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function FlowRow(e) {
            var t = e.flow, r = e.selected, l = e.highlighted, o = e.onSelect, s = e.displayColumnNames,
                u = (0, _classnames2.default)({
                    selected: r,
                    highlighted: l,
                    intercepted: t.intercepted,
                    "has-request": t.request,
                    "has-response": t.response
                }), a = (0, _FlowTableHead.getDisplayColumns)(s);
            return _react2.default.createElement("tr", {
                className: u, onClick: function () {
                    return o(t.id)
                }
            }, a.map(function (e) {
                return _react2.default.createElement(e, {key: e.name, flow: t})
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), _FlowColumns = require("./FlowColumns"),
            _utils = require("../../utils"), _FlowTableHead = require("./FlowTableHead"),
            _reactRedux = require("react-redux");
        FlowRow.propTypes = {
            onSelect: _propTypes2.default.func.isRequired,
            flow: _propTypes2.default.object.isRequired,
            highlighted: _propTypes2.default.bool,
            selected: _propTypes2.default.bool
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {displayColumnNames: e.options.web_columns ? e.options.web_columns.value : _FlowColumns.defaultColumnNames}
        })((0, _utils.pure)(FlowRow));

    }, {
        "../../utils": 70,
        "./FlowColumns": 17,
        "./FlowTableHead": 19,
        "classnames": "classnames",
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    19: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function getDisplayColumns(e) {
            var r = [];
            if (void 0 === e) return _FlowColumns2.default;
            var o = !0, s = !1, t = void 0;
            try {
                for (var l, a = _FlowColumns2.default[Symbol.iterator](); !(o = (l = a.next()).done); o = !0) {
                    var u = l.value;
                    e.includes(u.name.slice(0, -6).toLowerCase()) && r.push(u)
                }
            } catch (e) {
                s = !0, t = e
            } finally {
                try {
                    !o && a.return && a.return()
                } finally {
                    if (s) throw t
                }
            }
            return r
        }

        function FlowTableHead(e) {
            var r = e.sortColumn, o = e.sortDesc, s = e.setSort, t = e.displayColumnNames,
                l = o ? "sort-desc" : "sort-asc", a = getDisplayColumns(t);
            return _react2.default.createElement("tr", null, a.map(function (e) {
                return _react2.default.createElement("th", {
                    className: (0, _classnames2.default)(e.headerClass, r === e.name && l),
                    key: e.name,
                    onClick: function () {
                        return s(e.name, e.name === r && !o)
                    }
                }, e.headerName)
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.getDisplayColumns = getDisplayColumns, exports.FlowTableHead = FlowTableHead;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _classnames = require("classnames"), _classnames2 = _interopRequireDefault(_classnames),
            _FlowColumns = require("./FlowColumns"), _FlowColumns2 = _interopRequireDefault(_FlowColumns),
            _flows = require("../../ducks/flows");
        FlowTableHead.propTypes = {
            setSort: _propTypes2.default.func.isRequired,
            sortDesc: _propTypes2.default.bool.isRequired,
            sortColumn: _propTypes2.default.string,
            displayColumnNames: _propTypes2.default.array
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {
                sortDesc: e.flows.sort.desc,
                sortColumn: e.flows.sort.column,
                displayColumnNames: e.options.web_columns ? e.options.web_columns.value : _FlowColumns.defaultColumnNames
            }
        }, {setSort: _flows.setSort})(FlowTableHead);

    }, {
        "../../ducks/flows": 56,
        "./FlowColumns": 17,
        "classnames": "classnames",
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    20: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function FlowView(e) {
            var r = e.flow, a = e.tabName, t = e.selectTab, s = ["request", "response", "error"].filter(function (e) {
                return r[e]
            });
            s.push("details"), s.indexOf(a) < 0 && (a = "response" === a && r.error ? "error" : "error" === a && r.response ? "response" : s[0]);
            var l = allTabs[_lodash2.default.capitalize(a)];
            return _react2.default.createElement("div", {className: "flow-detail"}, _react2.default.createElement(_Nav2.default, {
                tabs: s,
                active: a,
                onSelectTab: t
            }), _react2.default.createElement(l, {flow: r}))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.allTabs = void 0;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _reactRedux = require("react-redux"),
            _lodash = require("lodash"), _lodash2 = _interopRequireDefault(_lodash), _Nav = require("./FlowView/Nav"),
            _Nav2 = _interopRequireDefault(_Nav), _Messages = require("./FlowView/Messages"),
            _Details = require("./FlowView/Details"), _Details2 = _interopRequireDefault(_Details),
            _flow = require("../ducks/ui/flow"), allTabs = exports.allTabs = {
                Request: _Messages.Request,
                Response: _Messages.Response,
                Error: _Messages.ErrorView,
                Details: _Details2.default
            };
        exports.default = (0, _reactRedux.connect)(function (e) {
            return {flow: e.flows.byId[e.flows.selected[0]], tabName: e.ui.flow.tab}
        }, {selectTab: _flow.selectTab})(FlowView);

    }, {
        "../ducks/ui/flow": 60,
        "./FlowView/Details": 21,
        "./FlowView/Messages": 23,
        "./FlowView/Nav": 24,
        "lodash": "lodash",
        "react": "react",
        "react-redux": "react-redux"
    }],
    21: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function TimeStamp(e) {
            var t = e.t, a = e.deltaTo, r = e.title;
            return t ? _react2.default.createElement("tr", null, _react2.default.createElement("td", null, r, ":"), _react2.default.createElement("td", null, (0, _utils.formatTimeStamp)(t), a && _react2.default.createElement("span", {className: "text-muted"}, "(", (0, _utils.formatTimeDelta)(1e3 * (t - a)), ")"))) : _react2.default.createElement("tr", null)
        }

        function ConnectionInfo(e) {
            var t = e.conn;
            return _react2.default.createElement("table", {className: "connection-table"}, _react2.default.createElement("tbody", null, _react2.default.createElement("tr", {key: "address"}, _react2.default.createElement("td", null, "Address:"), _react2.default.createElement("td", null, t.address.join(":"))), t.sni && _react2.default.createElement("tr", {key: "sni"}, _react2.default.createElement("td", null, _react2.default.createElement("abbr", {title: "TLS Server Name Indication"}, "TLS SNI:")), _react2.default.createElement("td", null, t.sni)), t.tls_version && _react2.default.createElement("tr", {key: "tls_version"}, _react2.default.createElement("td", null, "TLS version:"), _react2.default.createElement("td", null, t.tls_version)), t.cipher_name && _react2.default.createElement("tr", {key: "cipher_name"}, _react2.default.createElement("td", null, "cipher name:"), _react2.default.createElement("td", null, t.cipher_name)), t.alpn_proto_negotiated && _react2.default.createElement("tr", {key: "ALPN"}, _react2.default.createElement("td", null, _react2.default.createElement("abbr", {title: "ALPN protocol negotiated"}, "ALPN:")), _react2.default.createElement("td", null, t.alpn_proto_negotiated)), t.ip_address && _react2.default.createElement("tr", {key: "ip_address"}, _react2.default.createElement("td", null, "Resolved address:"), _react2.default.createElement("td", null, t.ip_address.join(":"))), t.source_address && _react2.default.createElement("tr", {key: "source_address"}, _react2.default.createElement("td", null, "Source address:"), _react2.default.createElement("td", null, t.source_address.join(":")))))
        }

        function CertificateInfo(e) {
            var t = e.flow;
            return _react2.default.createElement("div", null, t.client_conn.cert && [_react2.default.createElement("h4", {key: "name"}, "Client Certificate"), _react2.default.createElement("pre", {
                key: "value",
                style: {maxHeight: 100}
            }, t.client_conn.cert)], t.server_conn.cert && [_react2.default.createElement("h4", {key: "name"}, "Server Certificate"), _react2.default.createElement("pre", {
                key: "value",
                style: {maxHeight: 100}
            }, t.server_conn.cert)])
        }

        function Timing(e) {
            var t = e.flow, a = t.server_conn, r = t.client_conn, l = t.request, n = t.response, c = [{
                title: "Server conn. initiated",
                t: a.timestamp_start,
                deltaTo: l.timestamp_start
            }, {
                title: "Server conn. TCP handshake",
                t: a.timestamp_tcp_setup,
                deltaTo: l.timestamp_start
            }, {
                title: "Server conn. SSL handshake",
                t: a.timestamp_ssl_setup,
                deltaTo: l.timestamp_start
            }, {
                title: "Client conn. established",
                t: r.timestamp_start,
                deltaTo: l.timestamp_start
            }, {
                title: "Client conn. SSL handshake",
                t: r.timestamp_ssl_setup,
                deltaTo: l.timestamp_start
            }, {title: "First request byte", t: l.timestamp_start}, {
                title: "Request complete",
                t: l.timestamp_end,
                deltaTo: l.timestamp_start
            }, n && {
                title: "First response byte",
                t: n.timestamp_start,
                deltaTo: l.timestamp_start
            }, n && {title: "Response complete", t: n.timestamp_end, deltaTo: l.timestamp_start}];
            return _react2.default.createElement("div", null, _react2.default.createElement("h4", null, "Timing"), _react2.default.createElement("table", {className: "timing-table"}, _react2.default.createElement("tbody", null, c.filter(function (e) {
                return e
            }).sort(function (e, t) {
                return e.t - t.t
            }).map(function (e) {
                return _react2.default.createElement(TimeStamp, _extends({key: e.title}, e))
            }))))
        }

        function Details(e) {
            var t = e.flow;
            return _react2.default.createElement("section", {className: "detail"}, _react2.default.createElement("h4", null, "Client Connection"), _react2.default.createElement(ConnectionInfo, {conn: t.client_conn}), t.server_conn.address && [_react2.default.createElement("h4", null, "Server Connection"), _react2.default.createElement(ConnectionInfo, {conn: t.server_conn})], _react2.default.createElement(CertificateInfo, {flow: t}), _react2.default.createElement(Timing, {flow: t}))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var a = arguments[t];
                for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r])
            }
            return e
        };
        exports.TimeStamp = TimeStamp, exports.ConnectionInfo = ConnectionInfo, exports.CertificateInfo = CertificateInfo, exports.Timing = Timing, exports.default = Details;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _lodash = require("lodash"),
            _lodash2 = _interopRequireDefault(_lodash), _utils = require("../../utils.js");

    }, {"../../utils.js": 70, "lodash": "lodash", "react": "react"}],
    22: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _objectWithoutProperties(e, t) {
            var r = {};
            for (var n in e) t.indexOf(n) >= 0 || Object.prototype.hasOwnProperty.call(e, n) && (r[n] = e[n]);
            return r
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.HeaderEditor = void 0;
        var _extends = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
                }
                return e
            }, _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), _ValueEditor = require("../ValueEditor/ValueEditor"),
            _ValueEditor2 = _interopRequireDefault(_ValueEditor), _utils = require("../../utils"),
            HeaderEditor = exports.HeaderEditor = function (e) {
                function t(e) {
                    _classCallCheck(this, t);
                    var r = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.onKeyDown = r.onKeyDown.bind(r), r
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "render", value: function () {
                        var e = this.props, t = (e.onTab, _objectWithoutProperties(e, ["onTab"]));
                        return _react2.default.createElement(_ValueEditor2.default, _extends({}, t, {onKeyDown: this.onKeyDown}))
                    }
                }, {
                    key: "focus", value: function () {
                        _reactDom2.default.findDOMNode(this).focus()
                    }
                }, {
                    key: "onKeyDown", value: function (e) {
                        switch (e.keyCode) {
                            case _utils.Key.BACKSPACE:
                                var t = window.getSelection().getRangeAt(0);
                                0 === t.startOffset && 0 === t.endOffset && this.props.onRemove(e);
                                break;
                            case _utils.Key.ENTER:
                            case _utils.Key.TAB:
                                e.shiftKey || this.props.onTab(e)
                        }
                    }
                }]), t
            }(), Headers = function (e) {
                function t() {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "onChange", value: function (e, t, r) {
                        var n = _.cloneDeep(this.props.message[this.props.type]);
                        n[e][t] = r, n[e][0] || n[e][1] || (1 === n.length ? (n[0][0] = "Name", n[0][1] = "Value") : (n.splice(e, 1), e === n.length && (this._nextSel = e - 1 + "-value"))), this.props.onChange(n)
                    }
                }, {
                    key: "edit", value: function () {
                        this.refs["0-key"].focus()
                    }
                }, {
                    key: "onTab", value: function (e, t, r) {
                        var n = this.props.message[this.props.type];
                        if (0 !== t) if (e === n.length - 1) {
                            r.preventDefault();
                            var o = _.cloneDeep(this.props.message[this.props.type]);
                            o.push(["Name", "Value"]), this.props.onChange(o), this._nextSel = e + 1 + "-key"
                        } else this._nextSel = e + 1 + "-key"; else this._nextSel = e + "-value"
                    }
                }, {
                    key: "componentDidUpdate", value: function () {
                        this._nextSel && this.refs[this._nextSel] && (this.refs[this._nextSel].focus(), this._nextSel = void 0)
                    }
                }, {
                    key: "onRemove", value: function (e, t, r) {
                        1 === t ? (r.preventDefault(), this.refs[e + "-key"].focus()) : e > 0 && (r.preventDefault(), this.refs[e - 1 + "-value"].focus())
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = this.props, r = t.message, n = t.readonly;
                        return r[this.props.type] ? _react2.default.createElement("table", {className: "header-table"}, _react2.default.createElement("tbody", null, r[this.props.type].map(function (t, r) {
                            return _react2.default.createElement("tr", {key: r}, _react2.default.createElement("td", {className: "header-name"}, _react2.default.createElement(HeaderEditor, {
                                ref: r + "-key",
                                content: t[0],
                                readonly: n,
                                onDone: function (t) {
                                    return e.onChange(r, 0, t)
                                },
                                onRemove: function (t) {
                                    return e.onRemove(r, 0, t)
                                },
                                onTab: function (t) {
                                    return e.onTab(r, 0, t)
                                }
                            }), _react2.default.createElement("span", {className: "header-colon"}, ":")), _react2.default.createElement("td", {className: "header-value"}, _react2.default.createElement(HeaderEditor, {
                                ref: r + "-value",
                                content: t[1],
                                readonly: n,
                                onDone: function (t) {
                                    return e.onChange(r, 1, t)
                                },
                                onRemove: function (t) {
                                    return e.onRemove(r, 1, t)
                                },
                                onTab: function (t) {
                                    return e.onTab(r, 1, t)
                                }
                            })))
                        }))) : _react2.default.createElement("table", {className: "header-table"}, _react2.default.createElement("tbody", null))
                    }
                }]), t
            }();
        Headers.propTypes = {
            onChange: _propTypes2.default.func.isRequired,
            message: _propTypes2.default.object.isRequired,
            type: _propTypes2.default.string.isRequired
        }, Headers.defaultProps = {type: "headers"}, exports.default = Headers;

    }, {
        "../../utils": 70,
        "../ValueEditor/ValueEditor": 44,
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom"
    }],
    23: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function RequestLine(e) {
            var t = e.flow, r = e.readonly, n = e.updateFlow;
            return _react2.default.createElement("div", {className: "first-line request-line"}, _react2.default.createElement("div", null, _react2.default.createElement(_ValueEditor2.default, {
                content: t.request.method,
                readonly: r,
                onDone: function (e) {
                    return n({request: {method: e}})
                }
            }), " ", _react2.default.createElement(_ValidateEditor2.default, {
                content: _utils.RequestUtils.pretty_url(t.request),
                readonly: r,
                onDone: function (e) {
                    return n({request: _extends({path: ""}, (0, _utils.parseUrl)(e))})
                },
                isValid: function (e) {
                    return !!(0, _utils.parseUrl)(e).host
                }
            }), " ", _react2.default.createElement(_ValidateEditor2.default, {
                content: t.request.http_version,
                readonly: r,
                onDone: function (e) {
                    return n({request: {http_version: e}})
                },
                isValid: _utils.isValidHttpVersion
            })))
        }

        function ResponseLine(e) {
            var t = e.flow, r = e.readonly, n = e.updateFlow;
            return _react2.default.createElement("div", {className: "first-line response-line"}, _react2.default.createElement(_ValidateEditor2.default, {
                content: t.response.http_version,
                readonly: r,
                onDone: function (e) {
                    return n({response: {http_version: e}})
                },
                isValid: _utils.isValidHttpVersion
            }), " ", _react2.default.createElement(_ValidateEditor2.default, {
                content: t.response.status_code + "",
                readonly: r,
                onDone: function (e) {
                    return n({response: {code: parseInt(e)}})
                },
                isValid: function (e) {
                    return /^\d+$/.test(e)
                }
            }), " ", _react2.default.createElement(_ValueEditor2.default, {
                content: t.response.reason,
                readonly: r,
                onDone: function (e) {
                    return n({response: {msg: e}})
                }
            }))
        }

        function ErrorView(e) {
            var t = e.flow;
            return _react2.default.createElement("section", {className: "error"}, _react2.default.createElement("div", {className: "alert alert-warning"}, t.error.msg, _react2.default.createElement("div", null, _react2.default.createElement("small", null, (0, _utils2.formatTimeStamp)(t.error.timestamp)))))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.Response = exports.Request = void 0;
        var _createClass = function () {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var n = t[r];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                }
            }

            return function (t, r, n) {
                return r && e(t.prototype, r), n && e(t, n), t
            }
        }(), _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        };
        exports.ErrorView = ErrorView;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _utils = require("../../flow/utils.js"), _utils2 = require("../../utils.js"),
            _ContentView = require("../ContentView"), _ContentView2 = _interopRequireDefault(_ContentView),
            _ContentViewOptions = require("../ContentView/ContentViewOptions"),
            _ContentViewOptions2 = _interopRequireDefault(_ContentViewOptions),
            _ValidateEditor = require("../ValueEditor/ValidateEditor"),
            _ValidateEditor2 = _interopRequireDefault(_ValidateEditor),
            _ValueEditor = require("../ValueEditor/ValueEditor"), _ValueEditor2 = _interopRequireDefault(_ValueEditor),
            _HideInStatic = require("../common/HideInStatic"), _HideInStatic2 = _interopRequireDefault(_HideInStatic),
            _Headers = require("./Headers"), _Headers2 = _interopRequireDefault(_Headers),
            _flow = require("../../ducks/ui/flow"), _flows = require("../../ducks/flows"),
            FlowActions = _interopRequireWildcard(_flows), _ToggleEdit = require("./ToggleEdit"),
            _ToggleEdit2 = _interopRequireDefault(_ToggleEdit), Message = (0, _reactRedux.connect)(function (e) {
                return {flow: e.ui.flow.modifiedFlow || e.flows.byId[e.flows.selected[0]], isEdit: !!e.ui.flow.modifiedFlow}
            }, {updateFlow: _flow.updateEdit, uploadContent: FlowActions.uploadContent}),
            Request = exports.Request = function (e) {
                function t() {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "render", value: function () {
                        var e = this.props, t = e.flow, r = e.isEdit, n = e.updateFlow, a = e.uploadContent,
                            o = !r && (0 == t.request.contentLength || null == t.request.contentLength);
                        return _react2.default.createElement("section", {className: "request"}, _react2.default.createElement("article", null, _react2.default.createElement(_ToggleEdit2.default, null), _react2.default.createElement(RequestLine, {
                            flow: t,
                            readonly: !r,
                            updateFlow: n
                        }), _react2.default.createElement(_Headers2.default, {
                            message: t.request,
                            readonly: !r,
                            onChange: function (e) {
                                return n({request: {headers: e}})
                            }
                        }), _react2.default.createElement("hr", null), _react2.default.createElement(_ContentView2.default, {
                            readonly: !r,
                            flow: t,
                            onContentChange: function (e) {
                                return n({request: {content: e}})
                            },
                            message: t.request
                        }), _react2.default.createElement("hr", null), _react2.default.createElement(_Headers2.default, {
                            message: t.request,
                            readonly: !r,
                            onChange: function (e) {
                                return n({request: {trailers: e}})
                            },
                            type: "trailers"
                        })), _react2.default.createElement(_HideInStatic2.default, null, !o && _react2.default.createElement("footer", null, _react2.default.createElement(_ContentViewOptions2.default, {
                            flow: t,
                            readonly: !r,
                            message: t.request,
                            uploadContent: function (e) {
                                return a(t, e, "request")
                            }
                        }))))
                    }
                }]), t
            }();
        exports.Request = Request = Message(Request);
        var Response = exports.Response = function (e) {
            function t() {
                return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }

            return _inherits(t, _react.Component), _createClass(t, [{
                key: "render", value: function () {
                    var e = this.props, t = e.flow, r = e.isEdit, n = e.updateFlow, a = e.uploadContent,
                        o = !r && (0 == t.response.contentLength || null == t.response.contentLength);
                    return _react2.default.createElement("section", {className: "response"}, _react2.default.createElement("article", null, _react2.default.createElement(_ToggleEdit2.default, null), _react2.default.createElement(ResponseLine, {
                        flow: t,
                        readonly: !r,
                        updateFlow: n
                    }), _react2.default.createElement(_Headers2.default, {
                        message: t.response,
                        readonly: !r,
                        onChange: function (e) {
                            return n({response: {headers: e}})
                        }
                    }), _react2.default.createElement("hr", null), _react2.default.createElement(_ContentView2.default, {
                        readonly: !r,
                        flow: t,
                        onContentChange: function (e) {
                            return n({response: {content: e}})
                        },
                        message: t.response
                    }), _react2.default.createElement("hr", null), _react2.default.createElement(_Headers2.default, {
                        message: t.response,
                        readonly: !r,
                        onChange: function (e) {
                            return n({response: {trailers: e}})
                        },
                        type: "trailers"
                    })), _react2.default.createElement(_HideInStatic2.default, null, !o && _react2.default.createElement("footer", null, _react2.default.createElement(_ContentViewOptions2.default, {
                        flow: t,
                        message: t.response,
                        uploadContent: function (e) {
                            return a(t, e, "response")
                        },
                        readonly: !r
                    }))))
                }
            }]), t
        }();
        exports.Response = Response = Message(Response), ErrorView.propTypes = {flow: _propTypes2.default.object.isRequired};

    }, {
        "../../ducks/flows": 56,
        "../../ducks/ui/flow": 60,
        "../../flow/utils.js": 68,
        "../../utils.js": 70,
        "../ContentView": 4,
        "../ContentView/ContentViewOptions": 7,
        "../ValueEditor/ValidateEditor": 43,
        "../ValueEditor/ValueEditor": 44,
        "../common/HideInStatic": 49,
        "./Headers": 22,
        "./ToggleEdit": 25,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    24: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function NavAction(e) {
            var a = e.icon, t = e.title, r = e.onClick;
            return _react2.default.createElement("a", {
                title: t,
                href: "#",
                className: "nav-action",
                onClick: function (e) {
                    e.preventDefault(), r(e)
                }
            }, _react2.default.createElement("i", {className: "fa fa-fw " + a}))
        }

        function Nav(e) {
            var a = e.active, t = e.tabs, r = e.onSelectTab;
            return _react2.default.createElement("nav", {className: "nav-tabs nav-tabs-sm"}, t.map(function (e) {
                return _react2.default.createElement("a", {
                    key: e,
                    href: "#",
                    className: (0, _classnames2.default)({active: a === e}),
                    onClick: function (a) {
                        a.preventDefault(), r(e)
                    }
                }, _lodash2.default.capitalize(e))
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.NavAction = void 0, exports.default = Nav;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _classnames = require("classnames"), _classnames2 = _interopRequireDefault(_classnames),
            _lodash = require("lodash"), _lodash2 = _interopRequireDefault(_lodash);
        NavAction.propTypes = {
            icon: _propTypes2.default.string.isRequired,
            title: _propTypes2.default.string.isRequired,
            onClick: _propTypes2.default.func.isRequired
        }, exports.NavAction = NavAction, Nav.propTypes = {
            active: _propTypes2.default.string.isRequired,
            tabs: _propTypes2.default.array.isRequired,
            onSelectTab: _propTypes2.default.func.isRequired
        };

    }, {
        "classnames": "classnames",
        "lodash": "lodash",
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    25: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ToggleEdit(e) {
            var t = e.isEdit, i = e.startEdit, r = e.stopEdit, o = e.flow, l = e.modifiedFlow;
            return _react2.default.createElement("div", {className: "edit-flow-container"}, t ? _react2.default.createElement("a", {
                className: "edit-flow",
                title: "Finish Edit",
                onClick: function () {
                    return r(o, l)
                }
            }, _react2.default.createElement("i", {className: "fa fa-check"})) : _react2.default.createElement("a", {
                className: "edit-flow",
                title: "Edit Flow",
                onClick: function () {
                    return i(o)
                }
            }, _react2.default.createElement("i", {className: "fa fa-pencil"})))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _flow = require("../../ducks/ui/flow");
        ToggleEdit.propTypes = {
            isEdit: _propTypes2.default.bool.isRequired,
            flow: _propTypes2.default.object.isRequired,
            startEdit: _propTypes2.default.func.isRequired,
            stopEdit: _propTypes2.default.func.isRequired
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {
                isEdit: !!e.ui.flow.modifiedFlow,
                modifiedFlow: e.ui.flow.modifiedFlow || e.flows.byId[e.flows.selected[0]],
                flow: e.flows.byId[e.flows.selected[0]]
            }
        }, {startEdit: _flow.startEdit, stopEdit: _flow.stopEdit})(ToggleEdit);

    }, {"../../ducks/ui/flow": 60, "prop-types": "prop-types", "react": "react", "react-redux": "react-redux"}],
    26: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function Footer(e) {
            var t = e.settings, a = t.mode, l = t.intercept, s = t.showhost, c = t.no_upstream_cert, r = t.rawtcp,
                n = t.http2, u = t.websocket, i = t.anticache, o = t.anticomp, p = t.stickyauth, m = t.stickycookie,
                _ = t.stream_large_bodies, d = t.listen_host, b = t.listen_port, f = t.version, E = t.server;
            return _react2.default.createElement("footer", null, a && "regular" != a && _react2.default.createElement("span", {className: "label label-success"}, a, " mode"), l && _react2.default.createElement("span", {className: "label label-success"}, "Intercept: ", l), s && _react2.default.createElement("span", {className: "label label-success"}, "showhost"), c && _react2.default.createElement("span", {className: "label label-success"}, "no-upstream-cert"), r && _react2.default.createElement("span", {className: "label label-success"}, "raw-tcp"), !n && _react2.default.createElement("span", {className: "label label-success"}, "no-http2"), !u && _react2.default.createElement("span", {className: "label label-success"}, "no-websocket"), i && _react2.default.createElement("span", {className: "label label-success"}, "anticache"), o && _react2.default.createElement("span", {className: "label label-success"}, "anticomp"), p && _react2.default.createElement("span", {className: "label label-success"}, "stickyauth: ", p), m && _react2.default.createElement("span", {className: "label label-success"}, "stickycookie: ", m), _ && _react2.default.createElement("span", {className: "label label-success"}, "stream: ", (0, _utils.formatSize)(_)), _react2.default.createElement("div", {className: "pull-right"}, _react2.default.createElement(_HideInStatic2.default, null, E && _react2.default.createElement("span", {
                className: "label label-primary",
                title: "HTTP Proxy Server Address"
            }, d || "*", ":", b)), _react2.default.createElement("span", {
                className: "label label-info",
                title: "Mitmproxy Version"
            }, "v", f)))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _utils = require("../utils.js"), _HideInStatic = require("../components/common/HideInStatic"),
            _HideInStatic2 = _interopRequireDefault(_HideInStatic);
        Footer.propTypes = {settings: _propTypes2.default.object.isRequired}, exports.default = (0, _reactRedux.connect)(function (e) {
            return {settings: e.settings}
        })(Footer);

    }, {
        "../components/common/HideInStatic": 49,
        "../utils.js": 70,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    27: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _toConsumableArray(e) {
            if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
            }
            return Array.from(e)
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }

                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _classnames = require("classnames"), _classnames2 = _interopRequireDefault(_classnames),
            _MainMenu = require("./Header/MainMenu"), _MainMenu2 = _interopRequireDefault(_MainMenu),
            _OptionMenu = require("./Header/OptionMenu"), _OptionMenu2 = _interopRequireDefault(_OptionMenu),
            _FileMenu = require("./Header/FileMenu"), _FileMenu2 = _interopRequireDefault(_FileMenu),
            _FlowMenu = require("./Header/FlowMenu"), _FlowMenu2 = _interopRequireDefault(_FlowMenu),
            _header = require("../ducks/ui/header"), _ConnectionIndicator = require("./Header/ConnectionIndicator"),
            _ConnectionIndicator2 = _interopRequireDefault(_ConnectionIndicator),
            _HideInStatic = require("./common/HideInStatic"), _HideInStatic2 = _interopRequireDefault(_HideInStatic),
            Header = function (e) {
                function t() {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "handleClick", value: function (e, t) {
                        t.preventDefault(), this.props.setActiveMenu(e.title)
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, n = this.props, r = n.selectedFlowId, a = n.activeMenu,
                            u = [].concat(_toConsumableArray(t.entries));
                        r && u.push(_FlowMenu2.default);
                        var i = _.find(u, function (e) {
                            return e.title == a
                        }) || _MainMenu2.default;
                        return _react2.default.createElement("header", null, _react2.default.createElement("nav", {className: "nav-tabs nav-tabs-lg"}, _react2.default.createElement(_FileMenu2.default, null), u.map(function (t) {
                            return _react2.default.createElement("a", {
                                key: t.title,
                                href: "#",
                                className: (0, _classnames2.default)({active: t === i}),
                                onClick: function (n) {
                                    return e.handleClick(t, n)
                                }
                            }, t.title)
                        }), _react2.default.createElement(_HideInStatic2.default, null, _react2.default.createElement(_ConnectionIndicator2.default, null))), _react2.default.createElement("div", null, _react2.default.createElement(i, null)))
                    }
                }]), t
            }();
        Header.entries = [_MainMenu2.default, _OptionMenu2.default], exports.default = (0, _reactRedux.connect)(function (e) {
            return {selectedFlowId: e.flows.selected[0], activeMenu: e.ui.header.activeMenu}
        }, {setActiveMenu: _header.setActiveMenu})(Header);

    }, {
        "../ducks/ui/header": 61,
        "./Header/ConnectionIndicator": 28,
        "./Header/FileMenu": 29,
        "./Header/FlowMenu": 32,
        "./Header/MainMenu": 33,
        "./Header/OptionMenu": 35,
        "./common/HideInStatic": 49,
        "classnames": "classnames",
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    28: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ConnectionIndicator(e) {
            var n = e.state, t = e.message;
            switch (n) {
                case _connection.ConnectionState.INIT:
                    return _react2.default.createElement("span", {className: "connection-indicator init"}, "connecting…");
                case _connection.ConnectionState.FETCHING:
                    return _react2.default.createElement("span", {className: "connection-indicator fetching"}, "fetching data…");
                case _connection.ConnectionState.ESTABLISHED:
                    return _react2.default.createElement("span", {className: "connection-indicator established"}, "connected");
                case _connection.ConnectionState.ERROR:
                    return _react2.default.createElement("span", {
                        className: "connection-indicator error",
                        title: t
                    }, "connection lost");
                case _connection.ConnectionState.OFFLINE:
                    return _react2.default.createElement("span", {className: "connection-indicator offline"}, "offline")
            }
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.ConnectionIndicator = ConnectionIndicator;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _connection = require("../../ducks/connection");
        ConnectionIndicator.propTypes = {
            state: _propTypes2.default.symbol.isRequired,
            message: _propTypes2.default.string
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return e.connection
        })(ConnectionIndicator);

    }, {"../../ducks/connection": 54, "prop-types": "prop-types", "react": "react", "react-redux": "react-redux"}],
    29: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function FileMenu(e) {
            var t = e.clearFlows, r = e.loadFlows, l = e.saveFlows;
            return _react2.default.createElement(_Dropdown2.default, {
                className: "pull-left",
                btnClass: "special",
                text: "mitmproxy"
            }, _react2.default.createElement("a", {
                href: "#", onClick: function (e) {
                    return FileMenu.onNewClick(e, t)
                }
            }, _react2.default.createElement("i", {className: "fa fa-fw fa-trash"}), " Clear All"), _react2.default.createElement(_FileChooser2.default, {
                icon: "fa-folder-open",
                text: " Open...",
                onOpenFile: function (e) {
                    return r(e)
                }
            }), _react2.default.createElement("a", {
                href: "#", onClick: function (e) {
                    e.preventDefault(), l()
                }
            }, _react2.default.createElement("i", {className: "fa fa-fw fa-floppy-o"}), " Save..."), _react2.default.createElement(_HideInStatic2.default, null, _react2.default.createElement(_Dropdown.Divider, null), _react2.default.createElement("a", {
                href: "http://mitm.it/",
                target: "_blank"
            }, _react2.default.createElement("i", {className: "fa fa-fw fa-external-link"}), " Install Certificates...")))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.FileMenu = FileMenu;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _FileChooser = require("../common/FileChooser"), _FileChooser2 = _interopRequireDefault(_FileChooser),
            _Dropdown = require("../common/Dropdown"), _Dropdown2 = _interopRequireDefault(_Dropdown),
            _flows = require("../../ducks/flows"), flowsActions = _interopRequireWildcard(_flows),
            _modal = require("../../ducks/ui/modal"), modalActions = _interopRequireWildcard(_modal),
            _HideInStatic = require("../common/HideInStatic"), _HideInStatic2 = _interopRequireDefault(_HideInStatic);
        FileMenu.propTypes = {
            clearFlows: _propTypes2.default.func.isRequired,
            loadFlows: _propTypes2.default.func.isRequired,
            saveFlows: _propTypes2.default.func.isRequired
        }, FileMenu.onNewClick = function (e, t) {
            e.preventDefault(), confirm("Delete all flows?") && t()
        }, exports.default = (0, _reactRedux.connect)(null, {
            clearFlows: flowsActions.clear,
            loadFlows: flowsActions.upload,
            saveFlows: flowsActions.download
        })(FileMenu);

    }, {
        "../../ducks/flows": 56,
        "../../ducks/ui/modal": 64,
        "../common/Dropdown": 47,
        "../common/FileChooser": 48,
        "../common/HideInStatic": 49,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    30: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _utils = require("../../utils"),
            FilterDocs = function (e) {
                function t(e, r) {
                    _classCallCheck(this, t);
                    var n = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return n.state = {doc: t.doc}, n
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentWillMount", value: function () {
                        var e = this;
                        t.xhr || (t.xhr = (0, _utils.fetchApi)("/filter-help").then(function (e) {
                            return e.json()
                        }), t.xhr.catch(function () {
                            t.xhr = null
                        })), this.state.doc || t.xhr.then(function (r) {
                            t.doc = r, e.setState({doc: r})
                        })
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = this.state.doc;
                        return t ? _react2.default.createElement("table", {className: "table table-condensed"}, _react2.default.createElement("tbody", null, t.commands.map(function (t) {
                            return _react2.default.createElement("tr", {
                                key: t[1], onClick: function (r) {
                                    return e.props.selectHandler(t[0].split(" ")[0] + " ")
                                }
                            }, _react2.default.createElement("td", null, t[0].replace(" ", " ")), _react2.default.createElement("td", null, t[1]))
                        }), _react2.default.createElement("tr", {key: "docs-link"}, _react2.default.createElement("td", {colSpan: "2"}, _react2.default.createElement("a", {
                            href: "https://mitmproxy.org/docs/latest/concepts-filters/",
                            target: "_blank"
                        }, _react2.default.createElement("i", {className: "fa fa-external-link"}), "  mitmproxy docs"))))) : _react2.default.createElement("i", {className: "fa fa-spinner fa-spin"})
                    }
                }]), t
            }();
        FilterDocs.xhr = null, FilterDocs.doc = null, exports.default = FilterDocs;

    }, {"../../utils": 70, "react": "react"}],
    31: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var o = t[r];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, r, o) {
                    return r && e(t.prototype, r), o && e(t, o), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), _utils = require("../../utils.js"),
            _filt = require("../../filt/filt"), _filt2 = _interopRequireDefault(_filt),
            _FilterDocs = require("./FilterDocs"), _FilterDocs2 = _interopRequireDefault(_FilterDocs),
            FilterInput = function (e) {
                function t(e, r) {
                    _classCallCheck(this, t);
                    var o = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return o.state = {
                        value: o.props.value,
                        focus: !1,
                        mousefocus: !1
                    }, o.onChange = o.onChange.bind(o), o.onFocus = o.onFocus.bind(o), o.onBlur = o.onBlur.bind(o), o.onKeyDown = o.onKeyDown.bind(o), o.onMouseEnter = o.onMouseEnter.bind(o), o.onMouseLeave = o.onMouseLeave.bind(o), o.selectFilter = o.selectFilter.bind(o), o
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentWillReceiveProps",
                    value: function (e) {
                        this.setState({value: e.value})
                    }
                }, {
                    key: "isValid", value: function (e) {
                        try {
                            var t = null == e ? this.state.value : e;
                            return t && _filt2.default.parse(t), !0
                        } catch (e) {
                            return !1
                        }
                    }
                }, {
                    key: "getDesc", value: function () {
                        if (!this.state.value) return _react2.default.createElement(_FilterDocs2.default, {selectHandler: this.selectFilter});
                        try {
                            return _filt2.default.parse(this.state.value).desc
                        } catch (e) {
                            return "" + e
                        }
                    }
                }, {
                    key: "onChange", value: function (e) {
                        var t = e.target.value;
                        this.setState({value: t}), this.isValid(t) && this.props.onChange(t)
                    }
                }, {
                    key: "onFocus", value: function () {
                        this.setState({focus: !0})
                    }
                }, {
                    key: "onBlur", value: function () {
                        this.setState({focus: !1})
                    }
                }, {
                    key: "onMouseEnter", value: function () {
                        this.setState({mousefocus: !0})
                    }
                }, {
                    key: "onMouseLeave", value: function () {
                        this.setState({mousefocus: !1})
                    }
                }, {
                    key: "onKeyDown", value: function (e) {
                        e.keyCode !== _utils.Key.ESC && e.keyCode !== _utils.Key.ENTER || (this.blur(), this.setState({mousefocus: !1})), e.stopPropagation()
                    }
                }, {
                    key: "selectFilter", value: function (e) {
                        this.setState({value: e}), _reactDom2.default.findDOMNode(this.refs.input).focus()
                    }
                }, {
                    key: "blur", value: function () {
                        _reactDom2.default.findDOMNode(this.refs.input).blur()
                    }
                }, {
                    key: "select", value: function () {
                        _reactDom2.default.findDOMNode(this.refs.input).select()
                    }
                }, {
                    key: "render", value: function () {
                        var e = this.props, t = e.type, r = e.color, o = e.placeholder, n = this.state, a = n.value,
                            s = n.focus, u = n.mousefocus;
                        return _react2.default.createElement("div", {className: (0, _classnames2.default)("filter-input input-group", {"has-error": !this.isValid()})}, _react2.default.createElement("span", {className: "input-group-addon"}, _react2.default.createElement("i", {
                            className: "fa fa-fw fa-" + t,
                            style: {color: r}
                        })), _react2.default.createElement("input", {
                            type: "text",
                            ref: "input",
                            placeholder: o,
                            className: "form-control",
                            value: a,
                            onChange: this.onChange,
                            onFocus: this.onFocus,
                            onBlur: this.onBlur,
                            onKeyDown: this.onKeyDown
                        }), (s || u) && _react2.default.createElement("div", {
                            className: "popover bottom",
                            onMouseEnter: this.onMouseEnter,
                            onMouseLeave: this.onMouseLeave
                        }, _react2.default.createElement("div", {className: "arrow"}), _react2.default.createElement("div", {className: "popover-content"}, this.getDesc())))
                    }
                }]), t
            }();
        exports.default = FilterInput;

    }, {
        "../../filt/filt": 67,
        "../../utils.js": 70,
        "./FilterDocs": 30,
        "classnames": "classnames",
        "prop-types": "prop-types",
        "react": "react",
        "react-dom": "react-dom"
    }],
    32: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var l in e) Object.prototype.hasOwnProperty.call(e, l) && (t[l] = e[l]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function FlowMenu(e) {
            var t = e.flow, l = e.resumeFlow, r = e.killFlow, n = e.replayFlow, a = e.duplicateFlow, o = e.removeFlow,
                u = e.revertFlow;
            return t ? _react2.default.createElement("div", null, _react2.default.createElement(_HideInStatic2.default, null, _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_Button2.default, {
                title: "[r]eplay flow",
                icon: "fa-repeat text-primary",
                onClick: function () {
                    return n(t)
                }
            }, "Replay"), _react2.default.createElement(_Button2.default, {
                title: "[D]uplicate flow",
                icon: "fa-copy text-info",
                onClick: function () {
                    return a(t)
                }
            }, "Duplicate"), _react2.default.createElement(_Button2.default, {
                disabled: !t || !t.modified,
                title: "revert changes to flow [V]",
                icon: "fa-history text-warning",
                onClick: function () {
                    return u(t)
                }
            }, "Revert"), _react2.default.createElement(_Button2.default, {
                title: "[d]elete flow",
                icon: "fa-trash text-danger",
                onClick: function () {
                    return o(t)
                }
            }, "Delete")), _react2.default.createElement("div", {className: "menu-legend"}, "Flow Modification"))), _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_Button2.default, {
                title: "download",
                icon: "fa-download",
                onClick: function () {
                    return window.location = _utils.MessageUtils.getContentURL(t, t.response)
                }
            }, "Download")), _react2.default.createElement("div", {className: "menu-legend"}, "Export")), _react2.default.createElement(_HideInStatic2.default, null, _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_Button2.default, {
                disabled: !t || !t.intercepted,
                title: "[a]ccept intercepted flow",
                icon: "fa-play text-success",
                onClick: function () {
                    return l(t)
                }
            }, "Resume"), _react2.default.createElement(_Button2.default, {
                disabled: !t || !t.intercepted,
                title: "kill intercepted flow [x]",
                icon: "fa-times text-danger",
                onClick: function () {
                    return r(t)
                }
            }, "Abort"), _react2.default.createElement(_Button2.default, {

                title: "resvoer",
                icon: "fa-exchange",
                onClick: function () {
                    var names=document.getElementsByName("changecase");
                    var url=[];
                    var method=[];
                    var code=[];
                   for(var i=0;i<names.length;i++){
                       if (names[i].checked){
                           var allcheckout=(names[i].parentElement.parentElement);
                           url.push(allcheckout.getElementsByClassName("col-path")[0].innerHTML);
                           method.push(allcheckout.getElementsByClassName("col-method")[0].innerHTML);
                           code.push(allcheckout.getElementsByClassName("col-status")[0].innerHTML)
                       }
                   }
                   if(url.length>0){
                       var data={};
                       data['url']=url;
                       data['method']=method;
                       data['code']=code;

                       $.ajax({
                    url: 'luru',
                    type: 'POST',
                           header:{"Access-Control-Allow-Origin":"*"},
                    data: JSON.stringify(data),
                     contentType: "application/json; charset=utf-8",
                    processData: false,
                    success: function (result) {
                       alert('请去往接口平台查看你要写入的case')
                    }
                });
                   }
                }
            }, "一键转换")), _react2.default.createElement("div", {className: "menu-legend"}, "Interception")))) : _react2.default.createElement("div", null)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.FlowMenu = FlowMenu;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _Button = require("../common/Button"), _Button2 = _interopRequireDefault(_Button),
            _utils = require("../../flow/utils.js"), _flows = require("../../ducks/flows"),
            flowsActions = _interopRequireWildcard(_flows), _HideInStatic = require("../common/HideInStatic"),
            _HideInStatic2 = _interopRequireDefault(_HideInStatic);
        FlowMenu.title = "Flow", FlowMenu.propTypes = {
            flow: _propTypes2.default.object,
            resumeFlow: _propTypes2.default.func.isRequired,
            killFlow: _propTypes2.default.func.isRequired,
            replayFlow: _propTypes2.default.func.isRequired,
            duplicateFlow: _propTypes2.default.func.isRequired,
            removeFlow: _propTypes2.default.func.isRequired,
            revertFlow: _propTypes2.default.func.isRequired
        }, exports.default = (0, _reactRedux.connect)(function (e) {
            return {flow: e.flows.byId[e.flows.selected[0]]}
        }, {
            resumeFlow: flowsActions.resume,
            killFlow: flowsActions.kill,
            replayFlow: flowsActions.replay,
            duplicateFlow: flowsActions.duplicate,
            removeFlow: flowsActions.remove,
            revertFlow: flowsActions.revert
        })(FlowMenu);

    }, {
        "../../ducks/flows": 56,
        "../../flow/utils.js": 68,
        "../common/Button": 45,
        "../common/HideInStatic": 49,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    33: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function MainMenu() {
            return _react2.default.createElement("div", {className: "menu-main"}, _react2.default.createElement(FlowFilterInput, null), _react2.default.createElement(HighlightInput, null), _react2.default.createElement(InterceptInput, null))
        }

        function setIntercept(e) {
            (0, _settings.update)({intercept: e})
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = MainMenu, exports.setIntercept = setIntercept;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _FilterInput = require("./FilterInput"), _FilterInput2 = _interopRequireDefault(_FilterInput),
            _settings = require("../../ducks/settings"), _flows = require("../../ducks/flows");
        MainMenu.title = "Start";
        var InterceptInput = (0, _reactRedux.connect)(function (e) {
                return {
                    value: e.settings.intercept || "",
                    placeholder: "Intercept",
                    type: "pause",
                    color: "hsl(208, 56%, 53%)"
                }
            }, {onChange: setIntercept})(_FilterInput2.default), FlowFilterInput = (0, _reactRedux.connect)(function (e) {
                return {value: e.flows.filter || "", placeholder: "Search", type: "search", color: "black"}
            }, {onChange: _flows.setFilter})(_FilterInput2.default),
            HighlightInput = (0, _reactRedux.connect)(function (e) {
                return {
                    value: e.flows.highlight || "",
                    placeholder: "Highlight",
                    type: "tag",
                    color: "hsl(48, 100%, 50%)"
                }
            }, {onChange: _flows.setHighlight})(_FilterInput2.default);

    }, {
        "../../ducks/flows": 56,
        "../../ducks/settings": 59,
        "./FilterInput": 31,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    34: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _defineProperty(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e
        }

        function MenuToggle(e) {
            var t = e.value, n = e.onChange, r = e.children;
            return React.createElement("div", {className: "menu-entry"}, React.createElement("label", null, React.createElement("input", {
                type: "checkbox",
                checked: t,
                onChange: n
            }), r))
        }

        function SettingsToggle(e) {
            var t = e.setting, n = e.children, r = e.settings, g = e.updateSettings;
            return React.createElement(MenuToggle, {
                value: r[t] || !1, onChange: function () {
                    return g(_defineProperty({}, t, !r[t]))
                }
            }, n)
        }

        function EventlogToggle(e) {
            var t = e.toggleVisibility, n = e.eventLogVisible;
            return React.createElement(MenuToggle, {value: n, onChange: t}, "Display Event Log")
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.MenuToggle = MenuToggle, exports.SettingsToggle = SettingsToggle, exports.EventlogToggle = EventlogToggle;
        var _propTypes = require("prop-types"), _propTypes2 = _interopRequireDefault(_propTypes),
            _reactRedux = require("react-redux"), _settings = require("../../ducks/settings"),
            _eventLog = require("../../ducks/eventLog");
        MenuToggle.propTypes = {
            value: _propTypes2.default.bool.isRequired,
            onChange: _propTypes2.default.func.isRequired,
            children: _propTypes2.default.node.isRequired
        }, SettingsToggle.propTypes = {
            setting: _propTypes2.default.string.isRequired,
            children: _propTypes2.default.node.isRequired
        }, exports.SettingsToggle = SettingsToggle = (0, _reactRedux.connect)(function (e) {
            return {settings: e.settings}
        }, {updateSettings: _settings.update})(SettingsToggle), exports.EventlogToggle = EventlogToggle = (0, _reactRedux.connect)(function (e) {
            return {eventLogVisible: e.eventLog.visible}
        }, {toggleVisibility: _eventLog.toggleVisibility})(EventlogToggle);

    }, {
        "../../ducks/eventLog": 55,
        "../../ducks/settings": 59,
        "prop-types": "prop-types",
        "react-redux": "react-redux"
    }],
    35: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function OptionMenu(e) {
            var t = e.openOptions;
            return _react2.default.createElement("div", null, _react2.default.createElement(_HideInStatic2.default, null, _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_Button2.default, {
                title: "Open Options",
                icon: "fa-cogs text-primary",
                onClick: t
            }, "Edit Options ", _react2.default.createElement("sup", null, "alpha"))), _react2.default.createElement("div", {className: "menu-legend"}, "Options Editor")), _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_MenuToggle.SettingsToggle, {setting: "anticache"}, "Strip cache headers ", _react2.default.createElement(_DocsLink2.default, {resource: "overview-features/#anticache"})), _react2.default.createElement(_MenuToggle.SettingsToggle, {setting: "showhost"}, "Use host header for display"), _react2.default.createElement(_MenuToggle.SettingsToggle, {setting: "ssl_insecure"}, "Don't verify server certificates")), _react2.default.createElement("div", {className: "menu-legend"}, "Quick Options"))), _react2.default.createElement("div", {className: "menu-group"}, _react2.default.createElement("div", {className: "menu-content"}, _react2.default.createElement(_MenuToggle.EventlogToggle, null)), _react2.default.createElement("div", {className: "menu-legend"}, "View Options")))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _reactRedux = require("react-redux"),
            _MenuToggle = require("./MenuToggle"), _Button = require("../common/Button"),
            _Button2 = _interopRequireDefault(_Button), _DocsLink = require("../common/DocsLink"),
            _DocsLink2 = _interopRequireDefault(_DocsLink), _HideInStatic = require("../common/HideInStatic"),
            _HideInStatic2 = _interopRequireDefault(_HideInStatic), _modal = require("../../ducks/ui/modal"),
            modalActions = _interopRequireWildcard(_modal);
        OptionMenu.title = "Options", exports.default = (0, _reactRedux.connect)(null, {
            openOptions: function () {
                return modalActions.setActiveModal("OptionModal")
            }
        })(OptionMenu);

    }, {
        "../../ducks/ui/modal": 64,
        "../common/Button": 45,
        "../common/DocsLink": 46,
        "../common/HideInStatic": 49,
        "./MenuToggle": 34,
        "react": "react",
        "react-redux": "react-redux"
    }],
    36: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function MainView(e) {
            var t = e.hasSelection;
            return _react2.default.createElement("div", {className: "main-view"}, _react2.default.createElement(_FlowTable2.default, null), t && _react2.default.createElement(_Splitter2.default, {key: "splitter"}), t && _react2.default.createElement(_FlowView2.default, {key: "flowDetails"}))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _Splitter = require("./common/Splitter"), _Splitter2 = _interopRequireDefault(_Splitter),
            _FlowTable = require("./FlowTable"), _FlowTable2 = _interopRequireDefault(_FlowTable),
            _FlowView = require("./FlowView"), _FlowView2 = _interopRequireDefault(_FlowView);
        MainView.propTypes = {hasSelection: _propTypes2.default.bool.isRequired}, exports.default = (0, _reactRedux.connect)(function (e) {
            return {hasSelection: !!e.flows.byId[e.flows.selected[0]]}
        }, {})(MainView);

    }, {
        "./FlowTable": 16,
        "./FlowView": 20,
        "./common/Splitter": 50,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    37: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _reactRedux = require("react-redux"),
            _ModalList = require("./ModalList"), _ModalList2 = _interopRequireDefault(_ModalList),
            PureModal = function (e) {
                function t(e, r) {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r))
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "render", value: function () {
                        var e = this.props.activeModal, t = _ModalList2.default.find(function (t) {
                            return t.name === e
                        });
                        return e ? _react2.default.createElement(t, null) : _react2.default.createElement("div", null)
                    }
                }]), t
            }();
        exports.default = (0, _reactRedux.connect)(function (e) {
            return {activeModal: e.ui.modal.activeModal}
        })(PureModal);

    }, {"./ModalList": 39, "react": "react", "react-redux": "react-redux"}],
    38: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ModalLayout(e) {
            var a = e.children;
            return _react2.default.createElement("div", null, _react2.default.createElement("div", {className: "modal-backdrop fade in"}), _react2.default.createElement("div", {
                className: "modal modal-visible",
                id: "optionsModal",
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": "options"
            }, _react2.default.createElement("div", {
                className: "modal-dialog modal-lg",
                role: "document"
            }, _react2.default.createElement("div", {className: "modal-content"}, a))))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = ModalLayout;
        var _react = require("react"), _react2 = _interopRequireDefault(_react);

    }, {"react": "react"}],
    39: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function OptionModal() {
            return _react2.default.createElement(_ModalLayout2.default, null, _react2.default.createElement(_OptionModal2.default, null))
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _react = require("react"), _react2 = _interopRequireDefault(_react),
            _ModalLayout = require("./ModalLayout"), _ModalLayout2 = _interopRequireDefault(_ModalLayout),
            _OptionModal = require("./OptionModal"), _OptionModal2 = _interopRequireDefault(_OptionModal);
        exports.default = [OptionModal];

    }, {"./ModalLayout": 38, "./OptionModal": 41, "react": "react"}],
    40: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _objectWithoutProperties(e, t) {
            var n = {};
            for (var r in e) t.indexOf(r) >= 0 || Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]);
            return n
        }

        function BooleanOption(e) {
            var t = e.value, n = e.onChange, r = _objectWithoutProperties(e, ["value", "onChange"]);
            return _react2.default.createElement("div", {className: "checkbox"}, _react2.default.createElement("label", null, _react2.default.createElement("input", _extends({
                type: "checkbox",
                checked: t,
                onChange: function (e) {
                    return n(e.target.checked)
                }
            }, r)), "Enable"))
        }

        function StringOption(e) {
            var t = e.value, n = e.onChange, r = _objectWithoutProperties(e, ["value", "onChange"]);
            return _react2.default.createElement("input", _extends({
                type: "text",
                value: t || "",
                onChange: function (e) {
                    return n(e.target.value)
                }
            }, r))
        }

        function Optional(e) {
            return function (t) {
                var n = t.onChange, r = _objectWithoutProperties(t, ["onChange"]);
                return _react2.default.createElement(e, _extends({
                    onChange: function (e) {
                        return n(e || null)
                    }
                }, r))
            }
        }

        function NumberOption(e) {
            var t = e.value, n = e.onChange, r = _objectWithoutProperties(e, ["value", "onChange"]);
            return _react2.default.createElement("input", _extends({
                type: "number", value: t, onChange: function (e) {
                    return n(parseInt(e.target.value))
                }
            }, r))
        }

        function ChoicesOption(e) {
            var t = e.value, n = e.onChange, r = e.choices,
                o = _objectWithoutProperties(e, ["value", "onChange", "choices"]);
            return _react2.default.createElement("select", _extends({
                onChange: function (e) {
                    return n(e.target.value)
                }, value: t
            }, o), r.map(function (e) {
                return _react2.default.createElement("option", {key: e, value: e}, e)
            }))
        }

        function StringSequenceOption(e) {
            var t = e.value, n = e.onChange, r = _objectWithoutProperties(e, ["value", "onChange"]),
                o = Math.max(t.length, 1);
            return _react2.default.createElement("textarea", _extends({
                rows: o,
                value: t.join("\n"),
                onChange: function (e) {
                    return n(e.target.value.split("\n"))
                }
            }, r))
        }

        function PureOption(e) {
            var t = e.choices, n = e.type, r = e.value, o = e.onChange, a = e.name, u = e.error, i = void 0, p = {};
            return t ? (i = ChoicesOption, p.choices = t) : i = Options[n], i !== BooleanOption && (p.className = "form-control"), _react2.default.createElement("div", {className: (0, _classnames2.default)({"has-error": u})}, _react2.default.createElement(i, _extends({
                name: a,
                value: r,
                onChange: o,
                onKeyDown: stopPropagation
            }, p)))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.Options = exports.ChoicesOption = void 0;
        var _extends = Object.assign || function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                }
                return e
            }, _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _options = require("../../ducks/options"), _utils = require("../../utils"),
            _classnames = require("classnames"), _classnames2 = _interopRequireDefault(_classnames),
            stopPropagation = function (e) {
                e.keyCode !== _utils.Key.ESC && e.stopPropagation()
            };
        BooleanOption.PropTypes = {
            value: _propTypes2.default.bool.isRequired,
            onChange: _propTypes2.default.func.isRequired
        }, StringOption.PropTypes = {
            value: _propTypes2.default.string.isRequired,
            onChange: _propTypes2.default.func.isRequired
        }, NumberOption.PropTypes = {
            value: _propTypes2.default.number.isRequired,
            onChange: _propTypes2.default.func.isRequired
        }, ChoicesOption.PropTypes = {
            value: _propTypes2.default.string.isRequired,
            onChange: _propTypes2.default.func.isRequired
        }, exports.ChoicesOption = ChoicesOption, StringSequenceOption.PropTypes = {
            value: _propTypes2.default.string.isRequired,
            onChange: _propTypes2.default.func.isRequired
        };
        var Options = exports.Options = {
            bool: BooleanOption,
            str: StringOption,
            int: NumberOption,
            "optional str": Optional(StringOption),
            "sequence of str": StringSequenceOption
        };
        exports.default = (0, _reactRedux.connect)(function (e, t) {
            var n = t.name;
            return _extends({}, e.options[n], e.ui.optionsEditor[n])
        }, function (e, t) {
            var n = t.name;
            return {
                onChange: function (t) {
                    return e((0, _options.update)(n, t))
                }
            }
        })(PureOption);

    }, {
        "../../ducks/options": 58,
        "../../utils": 70,
        "classnames": "classnames",
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    41: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function PureOptionHelp(e) {
            var t = e.help;
            return _react2.default.createElement("div", {className: "help-block small"}, t)
        }

        function PureOptionError(e) {
            var t = e.error;
            return t ? _react2.default.createElement("div", {className: "small text-danger"}, t) : null
        }

        function PureOptionDefault(e) {
            var t = e.value, r = e.defaultVal;
            if (t === r) return null;
            if ("boolean" == typeof r) r = r ? "true" : "false"; else if (Array.isArray(r)) {
                if (_lodash2.default.isEmpty(_lodash2.default.compact(t)) && _lodash2.default.isEmpty(r)) return null;
                r = "[ ]"
            } else "" === r ? r = '""' : null === r && (r = "null");
            return _react2.default.createElement("div", {className: "small"}, "Default: ", _react2.default.createElement("strong", null, " ", r, " "), " ")
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var a = t[r];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }

            return function (t, r, a) {
                return r && e(t.prototype, r), a && e(t, a), t
            }
        }();
        exports.PureOptionDefault = PureOptionDefault;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _reactRedux = require("react-redux"),
            _modal = require("../../ducks/ui/modal"), modalAction = _interopRequireWildcard(_modal),
            _options = require("../../ducks/options"), optionAction = _interopRequireWildcard(_options),
            _Option = require("./Option"), _Option2 = _interopRequireDefault(_Option), _lodash = require("lodash"),
            _lodash2 = _interopRequireDefault(_lodash), OptionHelp = (0, _reactRedux.connect)(function (e, t) {
                var r = t.name;
                return {help: e.options[r].help}
            })(PureOptionHelp), OptionError = (0, _reactRedux.connect)(function (e, t) {
                var r = t.name;
                return {error: e.ui.optionsEditor[r] && e.ui.optionsEditor[r].error}
            })(PureOptionError), OptionDefault = (0, _reactRedux.connect)(function (e, t) {
                var r = t.name;
                return {value: e.options[r].value, defaultVal: e.options[r].default}
            })(PureOptionDefault), PureOptionModal = function (e) {
                function t(e, r) {
                    _classCallCheck(this, t);
                    var a = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return a.state = {title: "Options"}, a
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentWillUnmount", value: function () {
                    }
                }, {
                    key: "render", value: function () {
                        var e = this.props, t = e.hideModal, r = e.options, a = this.state.title;
                        return _react2.default.createElement("div", null, _react2.default.createElement("div", {className: "modal-header"}, _react2.default.createElement("button", {
                            type: "button",
                            className: "close",
                            "data-dismiss": "modal",
                            onClick: function () {
                                t()
                            }
                        }, _react2.default.createElement("i", {className: "fa fa-fw fa-times"})), _react2.default.createElement("div", {className: "modal-title"}, _react2.default.createElement("h4", null, a))), _react2.default.createElement("div", {className: "modal-body"}, _react2.default.createElement("div", {className: "form-horizontal"}, r.map(function (e) {
                            return _react2.default.createElement("div", {
                                key: e,
                                className: "form-group"
                            }, _react2.default.createElement("div", {className: "col-xs-6"}, _react2.default.createElement("label", {htmlFor: e}, e), _react2.default.createElement(OptionHelp, {name: e})), _react2.default.createElement("div", {className: "col-xs-6"}, _react2.default.createElement(_Option2.default, {name: e}), _react2.default.createElement(OptionError, {name: e}), _react2.default.createElement(OptionDefault, {name: e})))
                        }))), _react2.default.createElement("div", {className: "modal-footer"}))
                    }
                }]), t
            }();
        exports.default = (0, _reactRedux.connect)(function (e) {
            return {options: Object.keys(e.options).sort()}
        }, {hideModal: modalAction.hideModal, save: optionAction.save})(PureOptionModal);

    }, {
        "../../ducks/options": 58,
        "../../ducks/ui/modal": 64,
        "./Option": 40,
        "lodash": "lodash",
        "react": "react",
        "react-redux": "react-redux"
    }],
    42: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _reactRedux = require("react-redux"),
            _keyboard = require("../ducks/ui/keyboard"), _MainView = require("./MainView"),
            _MainView2 = _interopRequireDefault(_MainView), _Header = require("./Header"),
            _Header2 = _interopRequireDefault(_Header), _EventLog = require("./EventLog"),
            _EventLog2 = _interopRequireDefault(_EventLog), _Footer = require("./Footer"),
            _Footer2 = _interopRequireDefault(_Footer), _Modal = require("./Modal/Modal"),
            _Modal2 = _interopRequireDefault(_Modal), ProxyAppMain = function (e) {
                function t() {
                    return _classCallCheck(this, t), _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentWillMount", value: function () {
                        window.addEventListener("keydown", this.props.onKeyDown)
                    }
                }, {
                    key: "componentWillUnmount", value: function () {
                        window.removeEventListener("keydown", this.props.onKeyDown)
                    }
                }, {
                    key: "render", value: function () {
                        var e = this.props.showEventLog;
                        return _react2.default.createElement("div", {
                            id: "container",
                            tabIndex: "0"
                        }, _react2.default.createElement(_Header2.default, null), _react2.default.createElement(_MainView2.default, null), e && _react2.default.createElement(_EventLog2.default, {key: "eventlog"}), _react2.default.createElement(_Footer2.default, null), _react2.default.createElement(_Modal2.default, null))
                    }
                }]), t
            }();
        exports.default = (0, _reactRedux.connect)(function (e) {
            return {showEventLog: e.eventLog.visible}
        }, {onKeyDown: _keyboard.onKeyDown})(ProxyAppMain);

    }, {
        "../ducks/ui/keyboard": 63,
        "./EventLog": 14,
        "./Footer": 26,
        "./Header": 27,
        "./MainView": 36,
        "./Modal/Modal": 37,
        "prop-types": "prop-types",
        "react": "react",
        "react-redux": "react-redux"
    }],
    43: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _ValueEditor = require("./ValueEditor"),
            _ValueEditor2 = _interopRequireDefault(_ValueEditor), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), ValidateEditor = function (e) {
                function t(e) {
                    _classCallCheck(this, t);
                    var r = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.state = {valid: e.isValid(e.content)}, r.onInput = r.onInput.bind(r), r.onDone = r.onDone.bind(r), r
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "componentWillReceiveProps",
                    value: function (e) {
                        this.setState({valid: e.isValid(e.content)})
                    }
                }, {
                    key: "onInput", value: function (e) {
                        this.setState({valid: this.props.isValid(e)})
                    }
                }, {
                    key: "onDone", value: function (e) {
                        this.props.isValid(e) || (this.editor.reset(), e = this.props.content), this.props.onDone(e)
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = (0, _classnames2.default)(this.props.className, {
                            "has-success": this.state.valid,
                            "has-warning": !this.state.valid
                        });
                        return _react2.default.createElement(_ValueEditor2.default, {
                            content: this.props.content,
                            readonly: this.props.readonly,
                            onDone: this.onDone,
                            onInput: this.onInput,
                            className: t,
                            ref: function (t) {
                                return e.editor = t
                            }
                        })
                    }
                }]), t
            }();
        ValidateEditor.propTypes = {
            content: _propTypes2.default.string.isRequired,
            readonly: _propTypes2.default.bool,
            onDone: _propTypes2.default.func.isRequired,
            className: _propTypes2.default.string,
            isValid: _propTypes2.default.func.isRequired
        }, exports.default = ValidateEditor;

    }, {"./ValueEditor": 44, "classnames": "classnames", "prop-types": "prop-types", "react": "react"}],
    44: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var o = t[n];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, n, o) {
                    return n && e(t.prototype, n), o && e(t, o), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _lodash = require("lodash"),
            _lodash2 = _interopRequireDefault(_lodash), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), _utils = require("../../utils"),
            ValueEditor = function (e) {
                function t(e) {
                    _classCallCheck(this, t);
                    var n = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return n.state = {editable: !1}, n.onPaste = n.onPaste.bind(n), n.onMouseDown = n.onMouseDown.bind(n), n.onMouseUp = n.onMouseUp.bind(n), n.onFocus = n.onFocus.bind(n), n.onClick = n.onClick.bind(n), n.blur = n.blur.bind(n), n.onBlur = n.onBlur.bind(n), n.reset = n.reset.bind(n), n.onKeyDown = n.onKeyDown.bind(n), n.onInput = n.onInput.bind(n), n
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "blur", value: function () {
                        this.input.blur()
                    }
                }, {
                    key: "reset", value: function () {
                        this.input.innerHTML = _lodash2.default.escape(this.props.content)
                    }
                }, {
                    key: "render", value: function () {
                        var e = this, t = (0, _classnames2.default)("inline-input", {
                            readonly: this.props.readonly,
                            editable: !this.props.readonly
                        }, this.props.className);
                        return _react2.default.createElement("div", {
                            ref: function (t) {
                                return e.input = t
                            },
                            tabIndex: this.props.readonly ? void 0 : 0,
                            className: t,
                            contentEditable: this.state.editable || void 0,
                            onFocus: this.onFocus,
                            onMouseDown: this.onMouseDown,
                            onClick: this.onClick,
                            onBlur: this.onBlur,
                            onKeyDown: this.onKeyDown,
                            onInput: this.onInput,
                            onPaste: this.onPaste,
                            dangerouslySetInnerHTML: {__html: _lodash2.default.escape(this.props.content)}
                        })
                    }
                }, {
                    key: "onPaste", value: function (e) {
                        e.preventDefault();
                        var t = e.clipboardData.getData("text/plain");
                        document.execCommand("insertHTML", !1, t)
                    }
                }, {
                    key: "onMouseDown", value: function (e) {
                        this._mouseDown = !0, window.addEventListener("mouseup", this.onMouseUp)
                    }
                }, {
                    key: "onMouseUp", value: function () {
                        this._mouseDown && (this._mouseDown = !1, window.removeEventListener("mouseup", this.onMouseUp))
                    }
                }, {
                    key: "onClick", value: function (e) {
                        this.onMouseUp(), this.onFocus(e)
                    }
                }, {
                    key: "onFocus", value: function (e) {
                        var t = this;
                        if (!(this._mouseDown || this._ignore_events || this.state.editable || this.props.readonly)) {
                            var n = window.getSelection(), o = void 0;
                            if (n.rangeCount > 0) o = n.getRangeAt(0); else if (document.caretPositionFromPoint && e.clientX && e.clientY) {
                                var s = document.caretPositionFromPoint(e.clientX, e.clientY);
                                (o = document.createRange()).setStart(s.offsetNode, s.offset)
                            } else document.caretRangeFromPoint && e.clientX && e.clientY ? o = document.caretRangeFromPoint(e.clientX, e.clientY) : (o = document.createRange()).selectNodeContents(this.input);
                            this._ignore_events = !0, this.setState({editable: !0}, function () {
                                t.input.blur(), t.input.focus(), t._ignore_events = !1, o.selectNodeContents(t.input), n.removeAllRanges(), n.addRange(o)
                            })
                        }
                    }
                }, {
                    key: "onBlur", value: function (e) {
                        this._ignore_events || this.props.readonly || (window.getSelection().removeAllRanges(), this.setState({editable: !1}), this.props.onDone(this.input.textContent))
                    }
                }, {
                    key: "onKeyDown", value: function (e) {
                        switch (e.stopPropagation(), e.keyCode) {
                            case _utils.Key.ESC:
                                e.preventDefault(), this.reset(), this.blur();
                                break;
                            case _utils.Key.ENTER:
                                e.shiftKey || (e.preventDefault(), this.blur())
                        }
                        this.props.onKeyDown(e)
                    }
                }, {
                    key: "onInput", value: function () {
                        this.props.onInput(this.input.textContent)
                    }
                }]), t
            }();
        ValueEditor.propTypes = {
            content: _propTypes2.default.string.isRequired,
            readonly: _propTypes2.default.bool,
            onDone: _propTypes2.default.func.isRequired,
            className: _propTypes2.default.string,
            onInput: _propTypes2.default.func,
            onKeyDown: _propTypes2.default.func
        }, ValueEditor.defaultProps = {
            onInput: function () {
            }, onKeyDown: function () {
            }
        }, exports.default = ValueEditor;

    }, {
        "../../utils": 70,
        "classnames": "classnames",
        "lodash": "lodash",
        "prop-types": "prop-types",
        "react": "react"
    }],
    45: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function Button(e) {
            var t = e.onClick, r = e.children, a = e.icon, s = e.disabled, l = e.className, i = e.title;
            return _react2.default.createElement("div", {
                className: (0, _classnames2.default)(l, "btn btn-default"),
                onClick: s ? void 0 : t,
                disabled: s,
                title: i
            }, a && _react2.default.createElement("i", {className: "fa fa-fw " + a}), r)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = Button;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames);
        Button.propTypes = {
            onClick: _propTypes2.default.func.isRequired,
            children: _propTypes2.default.node.isRequired,
            icon: _propTypes2.default.string,
            title: _propTypes2.default.string
        };

    }, {"classnames": "classnames", "prop-types": "prop-types", "react": "react"}],
    46: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function DocsLink(e) {
            var r = e.children, t = "https://docs.mitmproxy.org/stable/" + e.resource;
            return _react2.default.createElement("a", {
                target: "_blank",
                href: t
            }, r || _react2.default.createElement("i", {className: "fa fa-question-circle"}))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = DocsLink;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes);
        DocsLink.propTypes = {resource: _propTypes2.default.string.isRequired};

    }, {"prop-types": "prop-types", "react": "react"}],
    47: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.Divider = void 0;
        var _createClass = function () {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }

                return function (t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), Divider = exports.Divider = function () {
                return _react2.default.createElement("hr", {className: "divider"})
            }, Dropdown = function (e) {
                function t(e, r) {
                    _classCallCheck(this, t);
                    var n = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return n.state = {open: !1}, n.close = n.close.bind(n), n.open = n.open.bind(n), n
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "close", value: function () {
                        this.setState({open: !1}), document.removeEventListener("click", this.close)
                    }
                }, {
                    key: "open", value: function (e) {
                        e.preventDefault(), this.state.open || (this.setState({open: !this.state.open}), document.addEventListener("click", this.close))
                    }
                }, {
                    key: "render", value: function () {
                        var e = this.props, t = e.dropup, r = e.className, n = e.btnClass, o = e.text, s = e.children;
                        return _react2.default.createElement("div", {className: (0, _classnames2.default)(t ? "dropup" : "dropdown", r, {open: this.state.open})}, _react2.default.createElement("a", {
                            href: "#",
                            className: n,
                            onClick: this.open
                        }, o), _react2.default.createElement("ul", {
                            className: "dropdown-menu",
                            role: "menu"
                        }, s.map(function (e, t) {
                            return _react2.default.createElement("li", {key: t}, " ", e, " ")
                        })))
                    }
                }]), t
            }();
        Dropdown.propTypes = {
            dropup: _propTypes2.default.bool,
            className: _propTypes2.default.string,
            btnClass: _propTypes2.default.string.isRequired
        }, Dropdown.defaultProps = {dropup: !1}, exports.default = Dropdown;

    }, {"classnames": "classnames", "prop-types": "prop-types", "react": "react"}],
    48: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function FileChooser(e) {
            var t = e.icon, r = e.text, a = e.className, p = e.title, i = e.onOpenFile, l = void 0;
            return _react2.default.createElement("a", {
                href: "#", onClick: function () {
                    return l.click()
                }, className: a, title: p
            }, _react2.default.createElement("i", {className: "fa fa-fw " + t}), r, _react2.default.createElement("input", {
                ref: function (e) {
                    return l = e
                }, className: "hidden", type: "file", onChange: function (e) {
                    e.preventDefault(), e.target.files.length > 0 && i(e.target.files[0]), l.value = ""
                }
            }))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = FileChooser;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes);
        FileChooser.propTypes = {
            icon: _propTypes2.default.string,
            text: _propTypes2.default.string,
            className: _propTypes2.default.string,
            title: _propTypes2.default.string,
            onOpenFile: _propTypes2.default.func.isRequired
        };

    }, {"prop-types": "prop-types", "react": "react"}],
    49: [function (require, module, exports) {
        (function (global) {
            "use strict";

            function _interopRequireDefault(e) {
                return e && e.__esModule ? e : {default: e}
            }

            function HideInStatic(e) {
                var t = e.children;
                return global.MITMWEB_STATIC ? null : [t]
            }

            Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = HideInStatic;
            var _react = require("react"), _react2 = _interopRequireDefault(_react);

        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

    }, {"react": "react"}],
    50: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var o = t[n];
                        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                    }
                }

                return function (t, n, o) {
                    return n && e(t.prototype, n), o && e(t, o), t
                }
            }(), _react = require("react"), _react2 = _interopRequireDefault(_react), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), _classnames = require("classnames"),
            _classnames2 = _interopRequireDefault(_classnames), Splitter = function (e) {
                function t(e, n) {
                    _classCallCheck(this, t);
                    var o = _possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
                    return o.state = {
                        applied: !1,
                        startX: !1,
                        startY: !1
                    }, o.onMouseMove = o.onMouseMove.bind(o), o.onMouseDown = o.onMouseDown.bind(o), o.onMouseUp = o.onMouseUp.bind(o), o.onDragEnd = o.onDragEnd.bind(o), o
                }

                return _inherits(t, _react.Component), _createClass(t, [{
                    key: "onMouseDown", value: function (e) {
                        this.setState({
                            startX: e.pageX,
                            startY: e.pageY
                        }), window.addEventListener("mousemove", this.onMouseMove), window.addEventListener("mouseup", this.onMouseUp), window.addEventListener("dragend", this.onDragEnd)
                    }
                }, {
                    key: "onDragEnd", value: function () {
                        _reactDom2.default.findDOMNode(this).style.transform = "", window.removeEventListener("dragend", this.onDragEnd), window.removeEventListener("mouseup", this.onMouseUp), window.removeEventListener("mousemove", this.onMouseMove)
                    }
                }, {
                    key: "onMouseUp", value: function (e) {
                        this.onDragEnd();
                        var t = _reactDom2.default.findDOMNode(this), n = t.previousElementSibling,
                            o = n.offsetHeight + e.pageY - this.state.startY;
                        "x" === this.props.axis && (o = n.offsetWidth + e.pageX - this.state.startX), n.style.flex = "0 0 " + Math.max(0, o) + "px", t.nextElementSibling.style.flex = "1 1 auto", this.setState({applied: !0}), this.onResize()
                    }
                }, {
                    key: "onMouseMove", value: function (e) {
                        var t = 0, n = 0;
                        "x" === this.props.axis ? t = e.pageX - this.state.startX : n = e.pageY - this.state.startY, _reactDom2.default.findDOMNode(this).style.transform = "translate(" + t + "px, " + n + "px)"
                    }
                }, {
                    key: "onResize", value: function () {
                        window.setTimeout(function () {
                            return window.dispatchEvent(new CustomEvent("resize"))
                        }, 1)
                    }
                }, {
                    key: "reset", value: function (e) {
                        if (this.state.applied) {
                            var t = _reactDom2.default.findDOMNode(this);
                            t.previousElementSibling.style.flex = "", t.nextElementSibling.style.flex = "", e || this.setState({applied: !1}), this.onResize()
                        }
                    }
                }, {
                    key: "componentWillUnmount", value: function () {
                        this.reset(!0)
                    }
                }, {
                    key: "render", value: function () {
                        return _react2.default.createElement("div", {className: (0, _classnames2.default)("splitter", "x" === this.props.axis ? "splitter-x" : "splitter-y")}, _react2.default.createElement("div", {
                            onMouseDown: this.onMouseDown,
                            draggable: "true"
                        }))
                    }
                }]), t
            }();
        Splitter.defaultProps = {axis: "x"}, exports.default = Splitter;

    }, {"classnames": "classnames", "react": "react", "react-dom": "react-dom"}],
    51: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function ToggleButton(e) {
            var t = e.checked, r = e.onToggle, o = e.text;
            return _react2.default.createElement("div", {
                className: "btn btn-toggle " + (t ? "btn-primary" : "btn-default"),
                onClick: r
            }, _react2.default.createElement("i", {className: "fa fa-fw " + (t ? "fa-check-square-o" : "fa-square-o")}), " ", o)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = ToggleButton;
        var _react = require("react"), _react2 = _interopRequireDefault(_react), _propTypes = require("prop-types"),
            _propTypes2 = _interopRequireDefault(_propTypes);
        ToggleButton.propTypes = {
            checked: _propTypes2.default.bool.isRequired,
            onToggle: _propTypes2.default.func.isRequired,
            text: _propTypes2.default.string.isRequired
        };

    }, {"prop-types": "prop-types", "react": "react"}],
    52: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(t) {
            return t && t.__esModule ? t : {default: t}
        }

        function _classCallCheck(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        function _inherits(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _createClass = function () {
                function t(t, e) {
                    for (var o = 0; o < e.length; o++) {
                        var r = e[o];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
                    }
                }

                return function (e, o, r) {
                    return o && t(e.prototype, o), r && t(e, r), e
                }
            }(), _get = function t(e, o, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, o);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : t(i, o, r)
                }
                if ("value" in n) return n.value;
                var c = n.get;
                if (void 0 !== c) return c.call(r)
            }, _react = require("react"), _react2 = _interopRequireDefault(_react), _reactDom = require("react-dom"),
            _reactDom2 = _interopRequireDefault(_reactDom), symShouldStick = Symbol("shouldStick"),
            isAtBottom = function (t) {
                return t.scrollTop + t.clientHeight === t.scrollHeight
            };
        exports.default = function (t) {
            var e, o;
            return Object.assign((o = e = function (e) {
                function o() {
                    return _classCallCheck(this, o), _possibleConstructorReturn(this, (o.__proto__ || Object.getPrototypeOf(o)).apply(this, arguments))
                }

                return _inherits(o, t), _createClass(o, [{
                    key: "componentWillUpdate", value: function () {
                        var t = _reactDom2.default.findDOMNode(this);
                        this[symShouldStick] = t.scrollTop && isAtBottom(t), _get(o.prototype.__proto__ || Object.getPrototypeOf(o.prototype), "componentWillUpdate", this) && _get(o.prototype.__proto__ || Object.getPrototypeOf(o.prototype), "componentWillUpdate", this).call(this)
                    }
                }, {
                    key: "componentDidUpdate", value: function () {
                        var t = _reactDom2.default.findDOMNode(this);
                        this[symShouldStick] && !isAtBottom(t) && (t.scrollTop = t.scrollHeight), _get(o.prototype.__proto__ || Object.getPrototypeOf(o.prototype), "componentDidUpdate", this) && _get(o.prototype.__proto__ || Object.getPrototypeOf(o.prototype), "componentDidUpdate", this).call(this)
                    }
                }]), o
            }(), e.displayName = t.name, o), t)
        };

    }, {"react": "react", "react-dom": "react-dom"}],
    53: [function (require, module, exports) {
        "use strict";

        function calcVScroll(t) {
            if (!t) return {start: 0, end: 0, paddingTop: 0, paddingBottom: 0};
            var e = t.itemCount, o = t.rowHeight, r = t.viewportTop, a = t.viewportHeight, i = t.itemHeights, l = r + a,
                n = 0, c = 0, d = 0, p = 0;
            if (i) for (var h = 0, s = 0; h < e; h++) {
                var m = i[h] || o;
                s <= r && h % 2 == 0 && (d = s, n = h), s <= l ? c = h + 1 : p += m, s += m
            } else n = -2 & Math.max(0, Math.floor(r / o) - 1), c = Math.min(e, n + Math.ceil(a / o) + 2), d = Math.min(n, e) * o, p = Math.max(0, e - c) * o;
            return {start: n, end: c, paddingTop: d, paddingBottom: p}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.calcVScroll = calcVScroll;

    }, {}],
    54: [function (require, module, exports) {
        "use strict";

        function reducer() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, e = arguments[1];
            switch (e.type) {
                case ConnectionState.ESTABLISHED:
                case ConnectionState.FETCHING:
                case ConnectionState.ERROR:
                case ConnectionState.OFFLINE:
                    return {state: e.type, message: e.message};
                default:
                    return t
            }
        }

        function startFetching() {
            return {type: ConnectionState.FETCHING}
        }

        function connectionEstablished() {
            return {type: ConnectionState.ESTABLISHED}
        }

        function connectionError(t) {
            return {type: ConnectionState.ERROR, message: t}
        }

        function setOffline() {
            return {type: ConnectionState.OFFLINE}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = reducer, exports.startFetching = startFetching, exports.connectionEstablished = connectionEstablished, exports.connectionError = connectionError, exports.setOffline = setOffline;
        var ConnectionState = exports.ConnectionState = {
            INIT: Symbol("init"),
            FETCHING: Symbol("fetching"),
            ESTABLISHED: Symbol("established"),
            ERROR: Symbol("error"),
            OFFLINE: Symbol("offline")
        }, defaultState = {state: ConnectionState.INIT, message: null};

    }, {}],
    55: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function _defineProperty(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function reduce() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case TOGGLE_VISIBILITY:
                    return _extends({}, e, {visible: !e.visible});
                case TOGGLE_FILTER:
                    var r = _extends({}, e.filters, _defineProperty({}, t.filter, !e.filters[t.filter]));
                    return _extends({}, e, {filters: r}, (0, storeActions.default)(e, storeActions.setFilter(function (e) {
                        return r[e.level]
                    })));
                case ADD:
                case RECEIVE:
                    return _extends({}, e, (0, storeActions.default)(e, storeActions[t.cmd](t.data, function (t) {
                        return e.filters[t.level]
                    })));
                default:
                    return e
            }
        }

        function toggleFilter(e) {
            return {type: TOGGLE_FILTER, filter: e}
        }

        function toggleVisibility() {
            return {type: TOGGLE_VISIBILITY}
        }

        function add(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "web",
                r = {id: Math.random().toString(), message: e, level: t};
            return {type: ADD, cmd: "add", data: r}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.TOGGLE_FILTER = exports.TOGGLE_VISIBILITY = exports.RECEIVE = exports.ADD = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i])
            }
            return e
        };
        exports.default = reduce, exports.toggleFilter = toggleFilter, exports.toggleVisibility = toggleVisibility, exports.add = add;
        var _store = require("./utils/store"), storeActions = _interopRequireWildcard(_store),
            ADD = exports.ADD = "EVENTS_ADD", RECEIVE = exports.RECEIVE = "EVENTS_RECEIVE",
            TOGGLE_VISIBILITY = exports.TOGGLE_VISIBILITY = "EVENTS_TOGGLE_VISIBILITY",
            TOGGLE_FILTER = exports.TOGGLE_FILTER = "EVENTS_TOGGLE_FILTER", defaultState = _extends({
                visible: !1,
                filters: {debug: !1, info: !0, web: !0, warn: !0, error: !0}
            }, (0, storeActions.default)(void 0, {}));

    }, {"./utils/store": 66}],
    56: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function reduce() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case ADD:
                case UPDATE:
                case REMOVE:
                case RECEIVE:
                    var r = storeActions[t.cmd](t.data, makeFilter(e.filter), makeSort(e.sort)), n = e.selected;
                    if (t.type === REMOVE && e.selected.includes(t.data)) if (e.selected.length > 1) n = n.filter(function (e) {
                        return e !== t.data
                    }); else if (n = [], t.data in e.viewIndex && e.view.length > 1) {
                        var o = e.viewIndex[t.data], i = void 0;
                        i = o === e.view.length - 1 ? e.view[o - 1] : e.view[o + 1], n.push(i.id)
                    }
                    return _extends({}, e, {selected: n}, (0, storeActions.default)(e, r));
                case SET_FILTER:
                    return _extends({}, e, {filter: t.filter}, (0, storeActions.default)(e, storeActions.setFilter(makeFilter(t.filter), makeSort(e.sort))));
                case SET_HIGHLIGHT:
                    return _extends({}, e, {highlight: t.highlight});
                case SET_SORT:
                    return _extends({}, e, {sort: t.sort}, (0, storeActions.default)(e, storeActions.setSort(makeSort(t.sort))));
                case SELECT:
                    return _extends({}, e, {selected: t.flowIds});
                default:
                    return e
            }
        }

        function makeFilter(e) {
            if (e) return _filt2.default.parse(e)
        }

        function makeSort(e) {
            var t = e.column, r = e.desc, n = sortKeyFuns[t];
            if (n) return function (e, t) {
                var o = n(e), i = n(t);
                return o > i ? r ? -1 : 1 : o < i ? r ? 1 : -1 : 0
            }
        }

        function setFilter(e) {
            return {type: SET_FILTER, filter: e}
        }

        function setHighlight(e) {
            return {type: SET_HIGHLIGHT, highlight: e}
        }

        function setSort(e, t) {
            return {type: SET_SORT, sort: {column: e, desc: t}}
        }

        function selectRelative(e, t) {
            var r = e.viewIndex[e.selected[0]], n = e.view.length - 1, o = void 0;
            void 0 === r ? o = t < 0 ? 0 : n : (o = r + t, o = window.Math.max(o, 0), o = window.Math.min(o, n));
            var i = e.view[o];
            return select(i ? i.id : void 0)
        }

        function resume(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/resume", {method: "POST"})
            }
        }

        function resumeAll() {
            return function (e) {
                return (0, _utils.fetchApi)("/flows/resume", {method: "POST"})
            }
        }

        function kill(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/kill", {method: "POST"})
            }
        }

        function killAll() {
            return function (e) {
                return (0, _utils.fetchApi)("/flows/kill", {method: "POST"})
            }
        }

        function remove(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id, {method: "DELETE"})
            }
        }

        function duplicate(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/duplicate", {method: "POST"})
            }
        }

        function replay(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/replay", {method: "POST"})
            }
        }

        function revert(e) {
            return function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/revert", {method: "POST"})
            }
        }

        function update(e, t) {
            return function (r) {
                return _utils.fetchApi.put("/flows/" + e.id, t)
            }
        }

        function uploadContent(e, t, r) {
            var n = new FormData;
            return t = new window.Blob([t], {type: "plain/text"}), n.append("file", t), function (t) {
                return (0, _utils.fetchApi)("/flows/" + e.id + "/" + r + "/content.data", {method: "POST", body: n})
            }
        }

        function clear() {
            return function (e) {
                return (0, _utils.fetchApi)("/clear", {method: "POST"})
            }
        }

        function download() {
            return window.location = "/flows/dump", {type: REQUEST_ACTION}
        }

        function upload(e) {
            var t = new FormData;
            return t.append("file", e), function (e) {
                return (0, _utils.fetchApi)("/flows/dump", {method: "POST", body: t})
            }
        }

        function select(e) {
            return {type: SELECT, flowIds: e ? [e] : []}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.REQUEST_ACTION = exports.SET_HIGHLIGHT = exports.SET_SORT = exports.SET_FILTER = exports.SELECT = exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        };
        exports.default = reduce, exports.makeFilter = makeFilter, exports.makeSort = makeSort, exports.setFilter = setFilter, exports.setHighlight = setHighlight, exports.setSort = setSort, exports.selectRelative = selectRelative, exports.resume = resume, exports.resumeAll = resumeAll, exports.kill = kill, exports.killAll = killAll, exports.remove = remove, exports.duplicate = duplicate, exports.replay = replay, exports.revert = revert, exports.update = update, exports.uploadContent = uploadContent, exports.clear = clear, exports.download = download, exports.upload = upload, exports.select = select;
        var _utils = require("../utils"), _store = require("./utils/store"),
            storeActions = _interopRequireWildcard(_store), _filt = require("../filt/filt"),
            _filt2 = _interopRequireDefault(_filt), _utils2 = require("../flow/utils"), ADD = exports.ADD = "FLOWS_ADD",
            UPDATE = exports.UPDATE = "FLOWS_UPDATE", REMOVE = exports.REMOVE = "FLOWS_REMOVE",
            RECEIVE = exports.RECEIVE = "FLOWS_RECEIVE", SELECT = exports.SELECT = "FLOWS_SELECT",
            SET_FILTER = exports.SET_FILTER = "FLOWS_SET_FILTER", SET_SORT = exports.SET_SORT = "FLOWS_SET_SORT",
            SET_HIGHLIGHT = exports.SET_HIGHLIGHT = "FLOWS_SET_HIGHLIGHT",
            REQUEST_ACTION = exports.REQUEST_ACTION = "FLOWS_REQUEST_ACTION", defaultState = _extends({
                highlight: null,
                filter: null,
                sort: {column: null, desc: !1},
                selected: []
            }, (0, storeActions.default)(void 0, {})), sortKeyFuns = {
                TLSColumn: function (e) {
                    return e.request.scheme
                }, PathColumn: function (e) {
                    return _utils2.RequestUtils.pretty_url(e.request)
                }, MethodColumn: function (e) {
                    return e.request.method
                }, StatusColumn: function (e) {
                    return e.response && e.response.status_code
                }, TimeColumn: function (e) {
                    return e.response && e.response.timestamp_end - e.request.timestamp_start
                }, SizeColumn: function (e) {
                    var t = e.request.contentLength;
                    return e.response && (t += e.response.contentLength || 0), t
                }
            };

    }, {"../filt/filt": 67, "../flow/utils": 68, "../utils": 70, "./utils/store": 66}],
    57: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _redux = require("redux"), _eventLog = require("./eventLog"),
            _eventLog2 = _interopRequireDefault(_eventLog), _flows = require("./flows"),
            _flows2 = _interopRequireDefault(_flows), _settings = require("./settings"),
            _settings2 = _interopRequireDefault(_settings), _index = require("./ui/index"),
            _index2 = _interopRequireDefault(_index), _connection = require("./connection"),
            _connection2 = _interopRequireDefault(_connection), _options = require("./options"),
            _options2 = _interopRequireDefault(_options);
        exports.default = (0, _redux.combineReducers)({
            eventLog: _eventLog2.default,
            flows: _flows2.default,
            settings: _settings2.default,
            connection: _connection2.default,
            ui: _index2.default,
            options: _options2.default
        });

    }, {
        "./connection": 54,
        "./eventLog": 55,
        "./flows": 56,
        "./options": 58,
        "./settings": 59,
        "./ui/index": 62,
        "redux": "redux"
    }],
    58: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function _defineProperty(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function reducer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case RECEIVE:
                    return t.data;
                case UPDATE:
                    return _extends({}, e, t.data);
                default:
                    return e
            }
        }

        function pureSendUpdate(e, t, r) {
            _utils.fetchApi.put("/options", _defineProperty({}, e, t)).then(function (t) {
                200 === t.status ? r(optionsEditorActions.updateSuccess(e)) : t.text().then(function (t) {
                    r(optionsEditorActions.updateError(e, t))
                })
            })
        }

        function update(e, t) {
            return function (r) {
                r(optionsEditorActions.startUpdate(e, t)), sendUpdate(e, t, r)
            }
        }

        function save() {
            return function (e) {
                return (0, _utils.fetchApi)("/options/save", {method: "POST"})
            }
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.REQUEST_UPDATE = exports.UPDATE = exports.RECEIVE = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o])
            }
            return e
        };
        exports.default = reducer, exports.pureSendUpdate = pureSendUpdate, exports.update = update, exports.save = save;
        var _utils = require("../utils"), _optionsEditor = require("./ui/optionsEditor"),
            optionsEditorActions = _interopRequireWildcard(_optionsEditor), _lodash = require("lodash"),
            _lodash2 = _interopRequireDefault(_lodash), RECEIVE = exports.RECEIVE = "OPTIONS_RECEIVE",
            UPDATE = exports.UPDATE = "OPTIONS_UPDATE", REQUEST_UPDATE = exports.REQUEST_UPDATE = "REQUEST_UPDATE",
            defaultState = {}, sendUpdate = _lodash2.default.throttle(pureSendUpdate, 700, {leading: !0, trailing: !0});

    }, {"../utils": 70, "./ui/optionsEditor": 65, "lodash": "lodash"}],
    59: [function (require, module, exports) {
        "use strict";

        function reducer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case RECEIVE:
                    return t.data;
                case UPDATE:
                    return _extends({}, e, t.data);
                default:
                    return e
            }
        }

        function update(e) {
            return _utils.fetchApi.put("/settings", e), {type: REQUEST_UPDATE}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.REQUEST_UPDATE = exports.UPDATE = exports.RECEIVE = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var E in r) Object.prototype.hasOwnProperty.call(r, E) && (e[E] = r[E])
            }
            return e
        };
        exports.default = reducer, exports.update = update;
        var _utils = require("../utils"), RECEIVE = exports.RECEIVE = "SETTINGS_RECEIVE",
            UPDATE = exports.UPDATE = "SETTINGS_UPDATE", REQUEST_UPDATE = exports.REQUEST_UPDATE = "REQUEST_UPDATE",
            defaultState = {};

    }, {"../utils": 70}],
    60: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(t) {
            return t && t.__esModule ? t : {default: t}
        }

        function _interopRequireWildcard(t) {
            if (t && t.__esModule) return t;
            var e = {};
            if (null != t) for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
            return e.default = t, e
        }

        function reducer() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, e = arguments[1],
                n = t.modifiedFlow, o = e.content || t.content, r = o && o.length <= t.maxContentLines;
            switch (e.type) {
                case START_EDIT:
                    return _extends({}, t, {modifiedFlow: e.flow, contentView: "Edit", showFullContent: !0});
                case UPDATE_EDIT:
                    return _extends({}, t, {modifiedFlow: _lodash2.default.merge({}, t.modifiedFlow, e.update)});
                case flowsActions.SELECT:
                    return _extends({}, t, {
                        modifiedFlow: !1,
                        displayLarge: !1,
                        contentView: n ? "Auto" : t.contentView,
                        showFullContent: r
                    });
                case flowsActions.UPDATE:
                    return e.data.id === t.modifiedFlow.id ? _extends({}, t, {
                        modifiedFlow: !1,
                        displayLarge: !1,
                        contentView: n ? "Auto" : t.contentView,
                        showFullContent: !1
                    }) : t;
                case SET_CONTENT_VIEW_DESCRIPTION:
                    return _extends({}, t, {viewDescription: e.description});
                case SET_SHOW_FULL_CONTENT:
                    return _extends({}, t, {showFullContent: !0});
                case SET_TAB:
                    return _extends({}, t, {
                        tab: e.tab ? e.tab : "request",
                        displayLarge: !1,
                        showFullContent: "Edit" === t.contentView
                    });
                case SET_CONTENT_VIEW:
                    return _extends({}, t, {contentView: e.contentView, showFullContent: "Edit" === e.contentView});
                case SET_CONTENT:
                    return _extends({}, t, {content: e.content, showFullContent: r});
                case DISPLAY_LARGE:
                    return _extends({}, t, {displayLarge: !0});
                default:
                    return t
            }
        }

        function setContentView(t) {
            return {type: SET_CONTENT_VIEW, contentView: t}
        }

        function displayLarge() {
            return {type: DISPLAY_LARGE}
        }

        function selectTab(t) {
            return {type: SET_TAB, tab: t}
        }

        function startEdit(t) {
            return {type: START_EDIT, flow: t}
        }

        function updateEdit(t) {
            return {type: UPDATE_EDIT, update: t}
        }

        function setContentViewDescription(t) {
            return {type: SET_CONTENT_VIEW_DESCRIPTION, description: t}
        }

        function setShowFullContent() {
            return {type: SET_SHOW_FULL_CONTENT}
        }

        function setContent(t) {
            return {type: SET_CONTENT, content: t}
        }

        function stopEdit(t, e) {
            return flowsActions.update(t, (0, _utils.getDiff)(t, e))
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.SET_CONTENT = exports.SET_CONTENT_VIEW_DESCRIPTION = exports.SET_SHOW_FULL_CONTENT = exports.UPLOAD_CONTENT = exports.UPDATE_EDIT = exports.START_EDIT = exports.SET_TAB = exports.DISPLAY_LARGE = exports.SET_CONTENT_VIEW = void 0;
        var _extends = Object.assign || function (t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e];
                for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o])
            }
            return t
        };
        exports.default = reducer, exports.setContentView = setContentView, exports.displayLarge = displayLarge, exports.selectTab = selectTab, exports.startEdit = startEdit, exports.updateEdit = updateEdit, exports.setContentViewDescription = setContentViewDescription, exports.setShowFullContent = setShowFullContent, exports.setContent = setContent, exports.stopEdit = stopEdit;
        var _flows = require("../flows"), flowsActions = _interopRequireWildcard(_flows),
            _utils = require("../../utils"), _lodash = require("lodash"), _lodash2 = _interopRequireDefault(_lodash),
            SET_CONTENT_VIEW = exports.SET_CONTENT_VIEW = "UI_FLOWVIEW_SET_CONTENT_VIEW",
            DISPLAY_LARGE = exports.DISPLAY_LARGE = "UI_FLOWVIEW_DISPLAY_LARGE",
            SET_TAB = exports.SET_TAB = "UI_FLOWVIEW_SET_TAB",
            START_EDIT = exports.START_EDIT = "UI_FLOWVIEW_START_EDIT",
            UPDATE_EDIT = exports.UPDATE_EDIT = "UI_FLOWVIEW_UPDATE_EDIT",
            UPLOAD_CONTENT = exports.UPLOAD_CONTENT = "UI_FLOWVIEW_UPLOAD_CONTENT",
            SET_SHOW_FULL_CONTENT = exports.SET_SHOW_FULL_CONTENT = "UI_SET_SHOW_FULL_CONTENT",
            SET_CONTENT_VIEW_DESCRIPTION = exports.SET_CONTENT_VIEW_DESCRIPTION = "UI_SET_CONTENT_VIEW_DESCRIPTION",
            SET_CONTENT = exports.SET_CONTENT = "UI_SET_CONTENT", defaultState = {
                displayLarge: !1,
                viewDescription: "",
                showFullContent: !1,
                modifiedFlow: !1,
                contentView: "Auto",
                tab: "request",
                content: [],
                maxContentLines: 80
            };

    }, {"../../utils": 70, "../flows": 56, "lodash": "lodash"}],
    61: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        }

        function reducer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case SET_ACTIVE_MENU:
                    return _extends({}, e, {activeMenu: t.activeMenu});
                case flowsActions.SELECT:
                    if (t.flowIds.length > 0 && !e.isFlowSelected) return _extends({}, e, {
                        activeMenu: "Flow",
                        isFlowSelected: !0
                    });
                    if (0 === t.flowIds.length && e.isFlowSelected) {
                        var r = e.activeMenu;
                        return "Flow" === r && (r = "Start"), _extends({}, e, {activeMenu: r, isFlowSelected: !1})
                    }
                    return e;
                default:
                    return e
            }
        }

        function setActiveMenu(e) {
            return {type: SET_ACTIVE_MENU, activeMenu: e}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.SET_ACTIVE_MENU = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        };
        exports.default = reducer, exports.setActiveMenu = setActiveMenu;
        var _flows = require("../flows"), flowsActions = _interopRequireWildcard(_flows),
            SET_ACTIVE_MENU = exports.SET_ACTIVE_MENU = "UI_SET_ACTIVE_MENU",
            defaultState = {activeMenu: "Start", isFlowSelected: !1};

    }, {"../flows": 56}],
    62: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _redux = require("redux"), _flow = require("./flow"), _flow2 = _interopRequireDefault(_flow),
            _header = require("./header"), _header2 = _interopRequireDefault(_header), _modal = require("./modal"),
            _modal2 = _interopRequireDefault(_modal), _optionsEditor = require("./optionsEditor"),
            _optionsEditor2 = _interopRequireDefault(_optionsEditor);
        exports.default = (0, _redux.combineReducers)({
            flow: _flow2.default,
            header: _header2.default,
            modal: _modal2.default,
            optionsEditor: _optionsEditor2.default
        });

    }, {"./flow": 60, "./header": 61, "./modal": 64, "./optionsEditor": 65, "redux": "redux"}],
    63: [function (require, module, exports) {
        "use strict";

        function _interopRequireWildcard(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
            return t.default = e, t
        }

        function onKeyDown(e) {
            if (e.ctrlKey || e.metaKey) return function () {
            };
            var t = e.keyCode, s = e.shiftKey;
            return e.preventDefault(), function (e, l) {
                var i = l().flows, r = i.byId[l().flows.selected[0]];
                switch (t) {
                    case _utils.Key.K:
                    case _utils.Key.UP:
                        e(flowsActions.selectRelative(i, -1));
                        break;
                    case _utils.Key.J:
                    case _utils.Key.DOWN:
                        e(flowsActions.selectRelative(i, 1));
                        break;
                    case _utils.Key.SPACE:
                    case _utils.Key.PAGE_DOWN:
                        e(flowsActions.selectRelative(i, 10));
                        break;
                    case _utils.Key.PAGE_UP:
                        e(flowsActions.selectRelative(i, -10));
                        break;
                    case _utils.Key.END:
                        e(flowsActions.selectRelative(i, 1e10));
                        break;
                    case _utils.Key.HOME:
                        e(flowsActions.selectRelative(i, -1e10));
                        break;
                    case _utils.Key.ESC:
                        e(l().ui.modal.activeModal ? modalActions.hideModal() : flowsActions.select(null));
                        break;
                    case _utils.Key.LEFT:
                        if (!r) break;
                        var o = ["request", "response", "error"].filter(function (e) {
                            return r[e]
                        }).concat(["details"]), a = l().ui.flow.tab, c = o[(o.indexOf(a) - 1 + o.length) % o.length];
                        e((0, _flow.selectTab)(c));
                        break;
                    case _utils.Key.TAB:
                    case _utils.Key.RIGHT:
                        if (!r) break;
                        var n = ["request", "response", "error"].filter(function (e) {
                            return r[e]
                        }).concat(["details"]), u = l().ui.flow.tab, f = n[(n.indexOf(u) + 1) % n.length];
                        e((0, _flow.selectTab)(f));
                        break;
                    case _utils.Key.D:
                        if (!r) return;
                        e(s ? flowsActions.duplicate(r) : flowsActions.remove(r));
                        break;
                    case _utils.Key.A:
                        s ? e(flowsActions.resumeAll()) : r && r.intercepted && e(flowsActions.resume(r));
                        break;
                    case _utils.Key.R:
                        !s && r && e(flowsActions.replay(r));
                        break;
                    case _utils.Key.V:
                        !s && r && r.modified && e(flowsActions.revert(r));
                        break;
                    case _utils.Key.X:
                        s ? e(flowsActions.killAll()) : r && r.intercepted && e(flowsActions.kill(r));
                        break;
                    case _utils.Key.Z:
                        s || e(flowsActions.clear());
                        break;
                    default:
                        return
                }
            }
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.onKeyDown = onKeyDown;
        var _utils = require("../../utils"), _flow = require("./flow"), _flows = require("../flows"),
            flowsActions = _interopRequireWildcard(_flows), _modal = require("./modal"),
            modalActions = _interopRequireWildcard(_modal);

    }, {"../../utils": 70, "../flows": 56, "./flow": 60, "./modal": 64}],
    64: [function (require, module, exports) {
        "use strict";

        function reducer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1];
            switch (t.type) {
                case SET_ACTIVE_MODAL:
                    return _extends({}, e, {activeModal: t.activeModal});
                case HIDE_MODAL:
                    return _extends({}, e, {activeModal: void 0});
                default:
                    return e
            }
        }

        function setActiveModal(e) {
            return {type: SET_ACTIVE_MODAL, activeModal: e}
        }

        function hideModal() {
            return {type: HIDE_MODAL}
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a])
            }
            return e
        };
        exports.default = reducer, exports.setActiveModal = setActiveModal, exports.hideModal = hideModal;
        var HIDE_MODAL = exports.HIDE_MODAL = "UI_HIDE_MODAL",
            SET_ACTIVE_MODAL = exports.SET_ACTIVE_MODAL = "UI_SET_ACTIVE_MODAL", defaultState = {activeModal: void 0};

    }, {}],
    65: [function (require, module, exports) {
        "use strict";

        function _defineProperty(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t, e
        }

        function reducer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, r = arguments[1];
            switch (r.type) {
                case OPTION_UPDATE_START:
                    return _extends({}, e, _defineProperty({}, r.option, {isUpdating: !0, value: r.value, error: !1}));
                case OPTION_UPDATE_SUCCESS:
                    return _extends({}, e, _defineProperty({}, r.option, void 0));
                case OPTION_UPDATE_ERROR:
                    var t = e[r.option].value;
                    return "boolean" == typeof t && (t = !t), _extends({}, e, _defineProperty({}, r.option, {
                        value: t,
                        isUpdating: !1,
                        error: r.error
                    }));
                case _modal.HIDE_MODAL:
                    return {};
                default:
                    return e
            }
        }

        function startUpdate(e, r) {
            return {type: OPTION_UPDATE_START, option: e, value: r}
        }

        function updateSuccess(e) {
            return {type: OPTION_UPDATE_SUCCESS, option: e}
        }

        function updateError(e, r) {
            return {type: OPTION_UPDATE_ERROR, option: e, error: r}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.OPTION_UPDATE_ERROR = exports.OPTION_UPDATE_SUCCESS = exports.OPTION_UPDATE_START = void 0;
        var _extends = Object.assign || function (e) {
            for (var r = 1; r < arguments.length; r++) {
                var t = arguments[r];
                for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
            }
            return e
        };
        exports.default = reducer, exports.startUpdate = startUpdate, exports.updateSuccess = updateSuccess, exports.updateError = updateError;
        var _modal = require("./modal"), OPTION_UPDATE_START = exports.OPTION_UPDATE_START = "UI_OPTION_UPDATE_START",
            OPTION_UPDATE_SUCCESS = exports.OPTION_UPDATE_SUCCESS = "UI_OPTION_UPDATE_SUCCESS",
            OPTION_UPDATE_ERROR = exports.OPTION_UPDATE_ERROR = "UI_OPTION_UPDATE_ERROR", defaultState = {};

    }, {"./modal": 64}],
    66: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _defineProperty(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }

        function _toConsumableArray(e) {
            if (Array.isArray(e)) {
                for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
                return r
            }
            return Array.from(e)
        }

        function reduce() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultState, t = arguments[1],
                r = e.byId, i = e.list, n = e.listIndex, a = e.view, o = e.viewIndex;
            switch (t.type) {
                case SET_FILTER:
                    a = (0, _stable2.default)(i.filter(t.filter), t.sort), o = {}, a.forEach(function (e, t) {
                        o[e.id] = t
                    });
                    break;
                case SET_SORT:
                    a = (0, _stable2.default)([].concat(_toConsumableArray(a)), t.sort), o = {}, a.forEach(function (e, t) {
                        o[e.id] = t
                    });
                    break;
                case ADD:
                    if (t.item.id in r) break;
                    if (r = _extends({}, r, _defineProperty({}, t.item.id, t.item)), n = _extends({}, n, _defineProperty({}, t.item.id, i.length)), i = [].concat(_toConsumableArray(i), [t.item]), t.filter(t.item)) {
                        var d = sortedInsert(e, t.item, t.sort);
                        a = d.view, o = d.viewIndex
                    }
                    break;
                case UPDATE:
                    r = _extends({}, r, _defineProperty({}, t.item.id, t.item)), (i = [].concat(_toConsumableArray(i)))[n[t.item.id]] = t.item;
                    var s = t.item.id in o, l = t.filter(t.item);
                    if (l && !s) {
                        var u = sortedInsert(e, t.item, t.sort);
                        a = u.view, o = u.viewIndex
                    } else if (!l && s) {
                        var f = removeData(a, o, t.item.id);
                        a = f.data, o = f.dataIndex
                    } else if (l && s) {
                        var v = sortedUpdate(e, t.item, t.sort);
                        a = v.view, o = v.viewIndex
                    }
                    break;
                case REMOVE:
                    if (!(t.id in r)) break;
                    delete (r = _extends({}, r))[t.id];
                    var c = removeData(i, n, t.id);
                    if (i = c.data, n = c.dataIndex, t.id in o) {
                        var E = removeData(a, o, t.id);
                        a = E.data, o = E.dataIndex
                    }
                    break;
                case RECEIVE:
                    i = t.list, n = {}, r = {}, i.forEach(function (e, t) {
                        r[e.id] = e, n[e.id] = t
                    }), a = i.filter(t.filter).sort(t.sort), o = {}, a.forEach(function (e, t) {
                        o[e.id] = t
                    })
            }
            return {byId: r, list: i, listIndex: n, view: a, viewIndex: o}
        }

        function setFilter() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultFilter,
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultSort;
            return {type: SET_FILTER, filter: e, sort: t}
        }

        function setSort() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : defaultSort;
            return {type: SET_SORT, sort: e}
        }

        function add(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultFilter,
                r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : defaultSort;
            return {type: ADD, item: e, filter: t, sort: r}
        }

        function update(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultFilter,
                r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : defaultSort;
            return {type: UPDATE, item: e, filter: t, sort: r}
        }

        function remove(e) {
            return {type: REMOVE, id: e}
        }

        function receive(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : defaultFilter,
                r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : defaultSort;
            return {type: RECEIVE, list: e, filter: t, sort: r}
        }

        function sortedInsert(e, t, r) {
            var i = sortedIndex(e.view, t, r), n = [].concat(_toConsumableArray(e.view)), a = _extends({}, e.viewIndex);
            n.splice(i, 0, t);
            for (var o = n.length - 1; o >= i; o--) a[n[o].id] = o;
            return {view: n, viewIndex: a}
        }

        function removeData(e, t, r) {
            var i = t[r], n = [].concat(_toConsumableArray(e)), a = _extends({}, t);
            delete a[r], n.splice(i, 1);
            for (var o = n.length - 1; o >= i; o--) a[n[o].id] = o;
            return {data: n, dataIndex: a}
        }

        function sortedUpdate(e, t, r) {
            var i = [].concat(_toConsumableArray(e.view)), n = _extends({}, e.viewIndex), a = n[t.id];
            for (i[a] = t; a + 1 < i.length && r(i[a], i[a + 1]) > 0;) i[a] = i[a + 1], i[a + 1] = t, n[t.id] = a + 1, n[i[a].id] = a, ++a;
            for (; a > 0 && r(i[a], i[a - 1]) < 0;) i[a] = i[a - 1], i[a - 1] = t, n[t.id] = a - 1, n[i[a].id] = a, --a;
            return {view: i, viewIndex: n}
        }

        function sortedIndex(e, t, r) {
            for (var i = 0, n = e.length; i < n;) {
                var a = i + n >>> 1;
                r(t, e[a]) >= 0 ? i = a + 1 : n = a
            }
            return i
        }

        function defaultFilter() {
            return !0
        }

        function defaultSort(e, t) {
            return 0
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.RECEIVE = exports.REMOVE = exports.UPDATE = exports.ADD = exports.SET_SORT = exports.SET_FILTER = void 0;
        var _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i])
            }
            return e
        };
        exports.default = reduce, exports.setFilter = setFilter, exports.setSort = setSort, exports.add = add, exports.update = update, exports.remove = remove, exports.receive = receive;
        var _stable = require("stable"), _stable2 = _interopRequireDefault(_stable),
            SET_FILTER = exports.SET_FILTER = "LIST_SET_FILTER", SET_SORT = exports.SET_SORT = "LIST_SET_SORT",
            ADD = exports.ADD = "LIST_ADD", UPDATE = exports.UPDATE = "LIST_UPDATE",
            REMOVE = exports.REMOVE = "LIST_REMOVE", RECEIVE = exports.RECEIVE = "LIST_RECEIVE",
            defaultState = {byId: {}, list: [], listIndex: {}, view: [], viewIndex: {}};

    }, {"stable": "stable"}],
    67: [function (require, module, exports) {
        "use strict";
        module.exports = function () {
            function e(t, r, n, s) {
                this.message = t, this.expected = r, this.found = n, this.location = s, this.name = "SyntaxError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, e)
            }

            return function (e, t) {
                function r() {
                    this.constructor = e
                }

                r.prototype = t.prototype, e.prototype = new r
            }(e, Error), {
                SyntaxError: e, parse: function (t) {
                    function r(e) {
                        var r, n, s = qr[e];
                        if (s) return s;
                        for (r = e - 1; !qr[r];) r--;
                        for (s = {
                            line: (s = qr[r]).line,
                            column: s.column,
                            seenCR: s.seenCR
                        }; r < e;) "\n" === (n = t.charAt(r)) ? (s.seenCR || s.line++, s.column = 1, s.seenCR = !1) : "\r" === n || "\u2028" === n || "\u2029" === n ? (s.line++, s.column = 1, s.seenCR = !0) : (s.column++, s.seenCR = !1), r++;
                        return qr[e] = s, s
                    }

                    function n(e, t) {
                        var n = r(e), s = r(t);
                        return {
                            start: {offset: e, line: n.line, column: n.column},
                            end: {offset: t, line: s.line, column: s.column}
                        }
                    }

                    function s(e) {
                        wr < Cr || (wr > Cr && (Cr = wr, Er = []), Er.push(e))
                    }

                    function i(t, r, n, s) {
                        return null !== r && function (e) {
                            var t = 1;
                            for (e.sort(function (e, t) {
                                return e.description < t.description ? -1 : e.description > t.description ? 1 : 0
                            }); t < e.length;) e[t - 1] === e[t] ? e.splice(t, 1) : t++
                        }(r), new e(null !== t ? t : function (e, t) {
                            var r, n, s, i = new Array(e.length);
                            for (s = 0; s < e.length; s++) i[s] = e[s].description;
                            return r = e.length > 1 ? i.slice(0, -1).join(", ") + " or " + i[e.length - 1] : i[0], n = t ? '"' + function (e) {
                                function r(e) {
                                    return e.charCodeAt(0).toString(16).toUpperCase()
                                }

                                return t.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (e) {
                                    return "\\x0" + r(e)
                                }).replace(/[\x10-\x1F\x80-\xFF]/g, function (e) {
                                    return "\\x" + r(e)
                                }).replace(/[\u0100-\u0FFF]/g, function (e) {
                                    return "\\u0" + r(e)
                                }).replace(/[\u1000-\uFFFF]/g, function (e) {
                                    return "\\u" + r(e)
                                })
                            }() + '"' : "end of input", "Expected " + r + " but " + n + " found."
                        }(r, n), r, n, s)
                    }

                    function u() {
                        var e, t;
                        return Fr++, e = wr, a() !== Z && (t = l()) !== Z && a() !== Z ? (Ar = e, e = re(t)) : (wr = e, e = Z), Fr--, e === Z && 0 === Fr && s(te), e
                    }

                    function c() {
                        var e;
                        return Fr++, se.test(t.charAt(wr)) ? (e = t.charAt(wr), wr++) : (e = Z, 0 === Fr && s(ie)), Fr--, e === Z && 0 === Fr && s(ne), e
                    }

                    function o() {
                        var e;
                        return Fr++, ce.test(t.charAt(wr)) ? (e = t.charAt(wr), wr++) : (e = Z, 0 === Fr && s(oe)), Fr--, e === Z && 0 === Fr && s(ue), e
                    }

                    function a() {
                        var e, t;
                        for (Fr++, e = [], t = c(); t !== Z;) e.push(t), t = c();
                        return Fr--, e === Z && (t = Z, 0 === Fr && s(ae)), e
                    }

                    function l() {
                        var e, r, n, i;
                        return e = wr, (r = p()) !== Z && a() !== Z ? (124 === t.charCodeAt(wr) ? (n = le, wr++) : (n = Z, 0 === Fr && s(pe)), n !== Z && a() !== Z && (i = l()) !== Z ? (Ar = e, e = r = fe(r, i)) : (wr = e, e = Z)) : (wr = e, e = Z), e === Z && (e = p()), e
                    }

                    function p() {
                        var e, r, n, i, u;
                        if (e = wr, (r = f()) !== Z && (n = a()) !== Z ? (38 === t.charCodeAt(wr) ? (i = de, wr++) : (i = Z, 0 === Fr && s(he)), i !== Z && a() !== Z && (u = p()) !== Z ? (Ar = e, e = r = ye(r, u)) : (wr = e, e = Z)) : (wr = e, e = Z), e === Z) {
                            if (e = wr, (r = f()) !== Z) {
                                if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                n !== Z && (i = p()) !== Z ? (Ar = e, e = r = ye(r, i)) : (wr = e, e = Z)
                            } else wr = e, e = Z;
                            e === Z && (e = f())
                        }
                        return e
                    }

                    function f() {
                        var e, r, n;
                        return e = wr, 33 === t.charCodeAt(wr) ? (r = ve, wr++) : (r = Z, 0 === Fr && s(me)), r !== Z && a() !== Z && (n = f()) !== Z ? (Ar = e, e = r = ge(n)) : (wr = e, e = Z), e === Z && (e = d()), e
                    }

                    function d() {
                        var e, r, n, i;
                        return e = wr, 40 === t.charCodeAt(wr) ? (r = be, wr++) : (r = Z, 0 === Fr && s(xe)), r !== Z && a() !== Z && (n = l()) !== Z && a() !== Z ? (41 === t.charCodeAt(wr) ? (i = Re, wr++) : (i = Z, 0 === Fr && s(we)), i !== Z ? (Ar = e, e = r = Ae(n)) : (wr = e, e = Z)) : (wr = e, e = Z), e === Z && (e = h()), e
                    }

                    function h() {
                        var e, r, n, i;
                        if (e = wr, t.substr(wr, 4) === qe ? (r = qe, wr += 4) : (r = Z, 0 === Fr && s(Ce)), r !== Z && (Ar = e, r = Ee()), (e = r) === Z && (e = wr, t.substr(wr, 5) === Fe ? (r = Fe, wr += 5) : (r = Z, 0 === Fr && s(ke)), r !== Z && (Ar = e, r = _e()), (e = r) === Z && (e = wr, t.substr(wr, 2) === Ue ? (r = Ue, wr += 2) : (r = Z, 0 === Fr && s(Te)), r !== Z && (Ar = e, r = je()), (e = r) === Z))) {
                            if (e = wr, t.substr(wr, 2) === Se ? (r = Se, wr += 2) : (r = Z, 0 === Fr && s(Pe)), r !== Z) {
                                if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Be(i)) : (wr = e, e = Z)
                            } else wr = e, e = Z;
                            if (e === Z) {
                                if (e = wr, t.substr(wr, 3) === He ? (r = He, wr += 3) : (r = Z, 0 === Fr && s(Ie)), r !== Z) {
                                    if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                    n !== Z && (i = v()) !== Z ? (Ar = e, e = r = We(i)) : (wr = e, e = Z)
                                } else wr = e, e = Z;
                                if (e === Z) {
                                    if (e = wr, t.substr(wr, 3) === ze ? (r = ze, wr += 3) : (r = Z, 0 === Fr && s(De)), r !== Z) {
                                        if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                        n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Ge(i)) : (wr = e, e = Z)
                                    } else wr = e, e = Z;
                                    if (e === Z) {
                                        if (e = wr, t.substr(wr, 2) === Je ? (r = Je, wr += 2) : (r = Z, 0 === Fr && s(Ke)), r !== Z) {
                                            if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                            n !== Z && (i = y()) !== Z ? (Ar = e, e = r = Le(i)) : (wr = e, e = Z)
                                        } else wr = e, e = Z;
                                        if (e === Z) {
                                            if (e = wr, t.substr(wr, 2) === Me ? (r = Me, wr += 2) : (r = Z, 0 === Fr && s(Ne)), r !== Z) {
                                                if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Oe(i)) : (wr = e, e = Z)
                                            } else wr = e, e = Z;
                                            if (e === Z) {
                                                if (e = wr, t.substr(wr, 4) === Qe ? (r = Qe, wr += 4) : (r = Z, 0 === Fr && s(Ve)), r !== Z) {
                                                    if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                    n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Xe(i)) : (wr = e, e = Z)
                                                } else wr = e, e = Z;
                                                if (e === Z && (e = wr, t.substr(wr, 2) === Ye ? (r = Ye, wr += 2) : (r = Z, 0 === Fr && s(Ze)), r !== Z && (Ar = e, r = $e()), (e = r) === Z)) {
                                                    if (e = wr, t.substr(wr, 2) === et ? (r = et, wr += 2) : (r = Z, 0 === Fr && s(tt)), r !== Z) {
                                                        if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                        n !== Z && (i = v()) !== Z ? (Ar = e, e = r = rt(i)) : (wr = e, e = Z)
                                                    } else wr = e, e = Z;
                                                    if (e === Z) {
                                                        if (e = wr, t.substr(wr, 3) === nt ? (r = nt, wr += 3) : (r = Z, 0 === Fr && s(st)), r !== Z) {
                                                            if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                            n !== Z && (i = v()) !== Z ? (Ar = e, e = r = it(i)) : (wr = e, e = Z)
                                                        } else wr = e, e = Z;
                                                        if (e === Z) {
                                                            if (e = wr, t.substr(wr, 3) === ut ? (r = ut, wr += 3) : (r = Z, 0 === Fr && s(ct)), r !== Z) {
                                                                if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                n !== Z && (i = v()) !== Z ? (Ar = e, e = r = ot(i)) : (wr = e, e = Z)
                                                            } else wr = e, e = Z;
                                                            if (e === Z && (e = wr, t.substr(wr, 5) === at ? (r = at, wr += 5) : (r = Z, 0 === Fr && s(lt)), r !== Z && (Ar = e, r = pt()), (e = r) === Z)) {
                                                                if (e = wr, t.substr(wr, 2) === ft ? (r = ft, wr += 2) : (r = Z, 0 === Fr && s(dt)), r !== Z) {
                                                                    if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                    n !== Z && (i = v()) !== Z ? (Ar = e, e = r = ht(i)) : (wr = e, e = Z)
                                                                } else wr = e, e = Z;
                                                                if (e === Z && (e = wr, t.substr(wr, 7) === yt ? (r = yt, wr += 7) : (r = Z, 0 === Fr && s(vt)), r !== Z && (Ar = e, r = mt()), (e = r) === Z && (e = wr, t.substr(wr, 2) === gt ? (r = gt, wr += 2) : (r = Z, 0 === Fr && s(bt)), r !== Z && (Ar = e, r = xt()), (e = r) === Z))) {
                                                                    if (e = wr, t.substr(wr, 4) === Rt ? (r = Rt, wr += 4) : (r = Z, 0 === Fr && s(wt)), r !== Z) {
                                                                        if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                        n !== Z && (i = v()) !== Z ? (Ar = e, e = r = At(i)) : (wr = e, e = Z)
                                                                    } else wr = e, e = Z;
                                                                    if (e === Z && (e = wr, t.substr(wr, 2) === qt ? (r = qt, wr += 2) : (r = Z, 0 === Fr && s(Ct)), r !== Z && (Ar = e, r = Et()), (e = r) === Z)) {
                                                                        if (e = wr, t.substr(wr, 2) === Ft ? (r = Ft, wr += 2) : (r = Z, 0 === Fr && s(kt)), r !== Z) {
                                                                            if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                            n !== Z && (i = v()) !== Z ? (Ar = e, e = r = _t(i)) : (wr = e, e = Z)
                                                                        } else wr = e, e = Z;
                                                                        if (e === Z && (e = wr, t.substr(wr, 4) === Ut ? (r = Ut, wr += 4) : (r = Z, 0 === Fr && s(Tt)), r !== Z && (Ar = e, r = jt()), (e = r) === Z)) {
                                                                            if (e = wr, t.substr(wr, 3) === St ? (r = St, wr += 3) : (r = Z, 0 === Fr && s(Pt)), r !== Z) {
                                                                                if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                                n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Bt(i)) : (wr = e, e = Z)
                                                                            } else wr = e, e = Z;
                                                                            if (e === Z) {
                                                                                if (e = wr, t.substr(wr, 3) === Ht ? (r = Ht, wr += 3) : (r = Z, 0 === Fr && s(It)), r !== Z) {
                                                                                    if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                                    n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Wt(i)) : (wr = e, e = Z)
                                                                                } else wr = e, e = Z;
                                                                                if (e === Z) {
                                                                                    if (e = wr, t.substr(wr, 2) === zt ? (r = zt, wr += 2) : (r = Z, 0 === Fr && s(Dt)), r !== Z) {
                                                                                        if (n = [], (i = c()) !== Z) for (; i !== Z;) n.push(i), i = c(); else n = Z;
                                                                                        n !== Z && (i = v()) !== Z ? (Ar = e, e = r = Gt(i)) : (wr = e, e = Z)
                                                                                    } else wr = e, e = Z;
                                                                                    e === Z && (e = wr, t.substr(wr, 10) === Jt ? (r = Jt, wr += 10) : (r = Z, 0 === Fr && s(Kt)), r !== Z && (Ar = e, r = Lt()), (e = r) === Z && (e = wr, (r = v()) !== Z && (Ar = e, r = Gt(r)), e = r))
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return e
                    }

                    function y() {
                        var e, r, n, i;
                        if (Fr++, e = wr, Nt.test(t.charAt(wr)) ? (r = t.charAt(wr), wr++) : (r = Z, 0 === Fr && s(Ot)), r === Z && (r = null), r !== Z) {
                            if (n = [], Qt.test(t.charAt(wr)) ? (i = t.charAt(wr), wr++) : (i = Z, 0 === Fr && s(Vt)), i !== Z) for (; i !== Z;) n.push(i), Qt.test(t.charAt(wr)) ? (i = t.charAt(wr), wr++) : (i = Z, 0 === Fr && s(Vt)); else n = Z;
                            n !== Z ? (Nt.test(t.charAt(wr)) ? (i = t.charAt(wr), wr++) : (i = Z, 0 === Fr && s(Ot)), i === Z && (i = null), i !== Z ? (Ar = e, e = r = Xt(n)) : (wr = e, e = Z)) : (wr = e, e = Z)
                        } else wr = e, e = Z;
                        return Fr--, e === Z && (r = Z, 0 === Fr && s(Mt)), e
                    }

                    function v() {
                        var e, r, n, i;
                        if (Fr++, e = wr, 34 === t.charCodeAt(wr) ? (r = Zt, wr++) : (r = Z, 0 === Fr && s($t)), r !== Z) {
                            for (n = [], i = m(); i !== Z;) n.push(i), i = m();
                            n !== Z ? (34 === t.charCodeAt(wr) ? (i = Zt, wr++) : (i = Z, 0 === Fr && s($t)), i !== Z ? (Ar = e, e = r = er(n)) : (wr = e, e = Z)) : (wr = e, e = Z)
                        } else wr = e, e = Z;
                        if (e === Z) {
                            if (e = wr, 39 === t.charCodeAt(wr) ? (r = tr, wr++) : (r = Z, 0 === Fr && s(rr)), r !== Z) {
                                for (n = [], i = g(); i !== Z;) n.push(i), i = g();
                                n !== Z ? (39 === t.charCodeAt(wr) ? (i = tr, wr++) : (i = Z, 0 === Fr && s(rr)), i !== Z ? (Ar = e, e = r = er(n)) : (wr = e, e = Z)) : (wr = e, e = Z)
                            } else wr = e, e = Z;
                            if (e === Z) if (e = wr, r = wr, Fr++, n = o(), Fr--, n === Z ? r = void 0 : (wr = r, r = Z), r !== Z) {
                                if (n = [], (i = b()) !== Z) for (; i !== Z;) n.push(i), i = b(); else n = Z;
                                n !== Z ? (Ar = e, e = r = er(n)) : (wr = e, e = Z)
                            } else wr = e, e = Z
                        }
                        return Fr--, e === Z && (r = Z, 0 === Fr && s(Yt)), e
                    }

                    function m() {
                        var e, r, n;
                        return e = wr, r = wr, Fr++, nr.test(t.charAt(wr)) ? (n = t.charAt(wr), wr++) : (n = Z, 0 === Fr && s(sr)), Fr--, n === Z ? r = void 0 : (wr = r, r = Z), r !== Z ? (t.length > wr ? (n = t.charAt(wr), wr++) : (n = Z, 0 === Fr && s(ir)), n !== Z ? (Ar = e, e = r = ur(n)) : (wr = e, e = Z)) : (wr = e, e = Z), e === Z && (e = wr, 92 === t.charCodeAt(wr) ? (r = cr, wr++) : (r = Z, 0 === Fr && s(or)), r !== Z && (n = x()) !== Z ? (Ar = e, e = r = ur(n)) : (wr = e, e = Z)), e
                    }

                    function g() {
                        var e, r, n;
                        return e = wr, r = wr, Fr++, ar.test(t.charAt(wr)) ? (n = t.charAt(wr), wr++) : (n = Z, 0 === Fr && s(lr)), Fr--, n === Z ? r = void 0 : (wr = r, r = Z), r !== Z ? (t.length > wr ? (n = t.charAt(wr), wr++) : (n = Z, 0 === Fr && s(ir)), n !== Z ? (Ar = e, e = r = ur(n)) : (wr = e, e = Z)) : (wr = e, e = Z), e === Z && (e = wr, 92 === t.charCodeAt(wr) ? (r = cr, wr++) : (r = Z, 0 === Fr && s(or)), r !== Z && (n = x()) !== Z ? (Ar = e, e = r = ur(n)) : (wr = e, e = Z)), e
                    }

                    function b() {
                        var e, r, n;
                        return e = wr, r = wr, Fr++, n = c(), Fr--, n === Z ? r = void 0 : (wr = r, r = Z), r !== Z ? (t.length > wr ? (n = t.charAt(wr), wr++) : (n = Z, 0 === Fr && s(ir)), n !== Z ? (Ar = e, e = r = ur(n)) : (wr = e, e = Z)) : (wr = e, e = Z), e
                    }

                    function x() {
                        var e, r;
                        return pr.test(t.charAt(wr)) ? (e = t.charAt(wr), wr++) : (e = Z, 0 === Fr && s(fr)), e === Z && (e = wr, 110 === t.charCodeAt(wr) ? (r = dr, wr++) : (r = Z, 0 === Fr && s(hr)), r !== Z && (Ar = e, r = yr()), (e = r) === Z && (e = wr, 114 === t.charCodeAt(wr) ? (r = vr, wr++) : (r = Z, 0 === Fr && s(mr)), r !== Z && (Ar = e, r = gr()), (e = r) === Z && (e = wr, 116 === t.charCodeAt(wr) ? (r = br, wr++) : (r = Z, 0 === Fr && s(xr)), r !== Z && (Ar = e, r = Rr()), e = r))), e
                    }

                    function R(e, t) {
                        function r() {
                            return e.apply(this, arguments) || t.apply(this, arguments)
                        }

                        return r.desc = e.desc + " or " + t.desc, r
                    }

                    function w(e, t) {
                        function r() {
                            return e.apply(this, arguments) && t.apply(this, arguments)
                        }

                        return r.desc = e.desc + " and " + t.desc, r
                    }

                    function A(e) {
                        function t() {
                            return !e.apply(this, arguments)
                        }

                        return t.desc = "not " + e.desc, t
                    }

                    function q(e) {
                        function t() {
                            return e.apply(this, arguments)
                        }

                        return t.desc = "(" + e.desc + ")", t
                    }

                    function C(e) {
                        return !0
                    }

                    function E(e) {
                        return !1
                    }

                    function F(e) {
                        if (e.response) for (var t = kr.ResponseUtils.getContentType(e.response), r = _r.length; r--;) if (_r[r].test(t)) return !0;
                        return !1
                    }

                    function k(e) {
                        function t(t) {
                            return t.response && t.response.status_code === e
                        }

                        return t.desc = "resp. code is " + e, t
                    }

                    function _(e) {
                        function t(e) {
                            return !0
                        }

                        return e = new RegExp(e, "i"), t.desc = "body filters are not implemented yet, see https://github.com/mitmproxy/mitmweb/issues/10", t
                    }

                    function U(e) {
                        function t(e) {
                            return !0
                        }

                        return e = new RegExp(e, "i"), t.desc = "body filters are not implemented yet, see https://github.com/mitmproxy/mitmweb/issues/10", t
                    }

                    function T(e) {
                        function t(e) {
                            return !0
                        }

                        return e = new RegExp(e, "i"), t.desc = "body filters are not implemented yet, see https://github.com/mitmproxy/mitmweb/issues/10", t
                    }

                    function j(e) {
                        function t(t) {
                            return t.request && (e.test(t.request.host) || e.test(t.request.pretty_host))
                        }

                        return e = new RegExp(e, "i"), t.desc = "domain matches " + e, t
                    }

                    function S(e) {
                        function t(t) {
                            return !!t.server_conn.address && e.test(t.server_conn.address[0] + ":" + t.server_conn.address[1])
                        }

                        return e = new RegExp(e, "i"), t.desc = "destination address matches " + e, t
                    }

                    function P(e) {
                        return !!e.error
                    }

                    function B(e) {
                        function t(t) {
                            return t.request && kr.RequestUtils.match_header(t.request, e) || t.response && kr.ResponseUtils.match_header(t.response, e)
                        }

                        return e = new RegExp(e, "i"), t.desc = "header matches " + e, t
                    }

                    function H(e) {
                        function t(t) {
                            return t.request && kr.RequestUtils.match_header(t.request, e)
                        }

                        return e = new RegExp(e, "i"), t.desc = "req. header matches " + e, t
                    }

                    function I(e) {
                        function t(t) {
                            return t.response && kr.ResponseUtils.match_header(t.response, e)
                        }

                        return e = new RegExp(e, "i"), t.desc = "resp. header matches " + e, t
                    }

                    function W(e) {
                        return "http" === e.type
                    }

                    function z(e) {
                        function t(t) {
                            return t.request && e.test(t.request.method)
                        }

                        return e = new RegExp(e, "i"), t.desc = "method matches " + e, t
                    }

                    function D(e) {
                        return e.marked
                    }

                    function G(e) {
                        return e.request && !e.response
                    }

                    function J(e) {
                        return !!e.response
                    }

                    function K(e) {
                        function t(t) {
                            return !!t.client_conn.address && e.test(t.client_conn.address[0] + ":" + t.client_conn.address[1])
                        }

                        return e = new RegExp(e, "i"), t.desc = "source address matches " + e, t
                    }

                    function L(e) {
                        function t(t) {
                            return t.request && e.test(kr.RequestUtils.getContentType(t.request)) || t.response && e.test(kr.ResponseUtils.getContentType(t.response))
                        }

                        return e = new RegExp(e, "i"), t.desc = "content type matches " + e, t
                    }

                    function M(e) {
                        return "tcp" === e.type
                    }

                    function N(e) {
                        function t(t) {
                            return t.request && e.test(kr.RequestUtils.getContentType(t.request))
                        }

                        return e = new RegExp(e, "i"), t.desc = "req. content type matches " + e, t
                    }

                    function O(e) {
                        function t(t) {
                            return t.response && e.test(kr.ResponseUtils.getContentType(t.response))
                        }

                        return e = new RegExp(e, "i"), t.desc = "resp. content type matches " + e, t
                    }

                    function Q(e) {
                        function t(t) {
                            return t.request && e.test(kr.RequestUtils.pretty_url(t.request))
                        }

                        return e = new RegExp(e, "i"), t.desc = "url matches " + e, t
                    }

                    function V(e) {
                        return "websocket" === e.type
                    }

                    var X, Y = arguments.length > 1 ? arguments[1] : {}, Z = {}, $ = {start: u}, ee = u,
                        te = {type: "other", description: "filter expression"}, re = function (e) {
                            return e
                        }, ne = {type: "other", description: "whitespace"}, se = /^[ \t\n\r]/,
                        ie = {type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]"},
                        ue = {type: "other", description: "control character"}, ce = /^[|&!()~"]/,
                        oe = {type: "class", value: '[|&!()~"]', description: '[|&!()~"]'},
                        ae = {type: "other", description: "optional whitespace"}, le = "|",
                        pe = {type: "literal", value: "|", description: '"|"'}, fe = function (e, t) {
                            return R(e, t)
                        }, de = "&", he = {type: "literal", value: "&", description: '"&"'}, ye = function (e, t) {
                            return w(e, t)
                        }, ve = "!", me = {type: "literal", value: "!", description: '"!"'}, ge = function (e) {
                            return A(e)
                        }, be = "(", xe = {type: "literal", value: "(", description: '"("'}, Re = ")",
                        we = {type: "literal", value: ")", description: '")"'}, Ae = function (e) {
                            return q(e)
                        }, qe = "true", Ce = {type: "literal", value: "true", description: '"true"'}, Ee = function () {
                            return C
                        }, Fe = "false", ke = {type: "literal", value: "false", description: '"false"'}, _e = function () {
                            return E
                        }, Ue = "~a", Te = {type: "literal", value: "~a", description: '"~a"'}, je = function () {
                            return F
                        }, Se = "~b", Pe = {type: "literal", value: "~b", description: '"~b"'}, Be = function (e) {
                            return _(e)
                        }, He = "~bq", Ie = {type: "literal", value: "~bq", description: '"~bq"'}, We = function (e) {
                            return U(e)
                        }, ze = "~bs", De = {type: "literal", value: "~bs", description: '"~bs"'}, Ge = function (e) {
                            return T(e)
                        }, Je = "~c", Ke = {type: "literal", value: "~c", description: '"~c"'}, Le = function (e) {
                            return k(e)
                        }, Me = "~d", Ne = {type: "literal", value: "~d", description: '"~d"'}, Oe = function (e) {
                            return j(e)
                        }, Qe = "~dst", Ve = {type: "literal", value: "~dst", description: '"~dst"'}, Xe = function (e) {
                            return S(e)
                        }, Ye = "~e", Ze = {type: "literal", value: "~e", description: '"~e"'}, $e = function () {
                            return P
                        }, et = "~h", tt = {type: "literal", value: "~h", description: '"~h"'}, rt = function (e) {
                            return B(e)
                        }, nt = "~hq", st = {type: "literal", value: "~hq", description: '"~hq"'}, it = function (e) {
                            return H(e)
                        }, ut = "~hs", ct = {type: "literal", value: "~hs", description: '"~hs"'}, ot = function (e) {
                            return I(e)
                        }, at = "~http", lt = {type: "literal", value: "~http", description: '"~http"'}, pt = function () {
                            return W
                        }, ft = "~m", dt = {type: "literal", value: "~m", description: '"~m"'}, ht = function (e) {
                            return z(e)
                        }, yt = "~marked", vt = {type: "literal", value: "~marked", description: '"~marked"'},
                        mt = function () {
                            return D
                        }, gt = "~q", bt = {type: "literal", value: "~q", description: '"~q"'}, xt = function () {
                            return G
                        }, Rt = "~src", wt = {type: "literal", value: "~src", description: '"~src"'}, At = function (e) {
                            return K(e)
                        }, qt = "~s", Ct = {type: "literal", value: "~s", description: '"~s"'}, Et = function () {
                            return J
                        }, Ft = "~t", kt = {type: "literal", value: "~t", description: '"~t"'}, _t = function (e) {
                            return L(e)
                        }, Ut = "~tcp", Tt = {type: "literal", value: "~tcp", description: '"~tcp"'}, jt = function () {
                            return M
                        }, St = "~tq", Pt = {type: "literal", value: "~tq", description: '"~tq"'}, Bt = function (e) {
                            return N(e)
                        }, Ht = "~ts", It = {type: "literal", value: "~ts", description: '"~ts"'}, Wt = function (e) {
                            return O(e)
                        }, zt = "~u", Dt = {type: "literal", value: "~u", description: '"~u"'}, Gt = function (e) {
                            return Q(e)
                        }, Jt = "~websocket", Kt = {type: "literal", value: "~websocket", description: '"~websocket"'},
                        Lt = function () {
                            return V
                        }, Mt = {type: "other", description: "integer"}, Nt = /^['"]/,
                        Ot = {type: "class", value: "['\"]", description: "['\"]"}, Qt = /^[0-9]/,
                        Vt = {type: "class", value: "[0-9]", description: "[0-9]"}, Xt = function (e) {
                            return parseInt(e.join(""), 10)
                        }, Yt = {type: "other", description: "string"}, Zt = '"',
                        $t = {type: "literal", value: '"', description: '"\\""'}, er = function (e) {
                            return e.join("")
                        }, tr = "'", rr = {type: "literal", value: "'", description: '"\'"'}, nr = /^["\\]/,
                        sr = {type: "class", value: '["\\\\]', description: '["\\\\]'},
                        ir = {type: "any", description: "any character"}, ur = function (e) {
                            return e
                        }, cr = "\\", or = {type: "literal", value: "\\", description: '"\\\\"'}, ar = /^['\\]/,
                        lr = {type: "class", value: "['\\\\]", description: "['\\\\]"}, pr = /^['"\\]/,
                        fr = {type: "class", value: "['\"\\\\]", description: "['\"\\\\]"}, dr = "n",
                        hr = {type: "literal", value: "n", description: '"n"'}, yr = function () {
                            return "\n"
                        }, vr = "r", mr = {type: "literal", value: "r", description: '"r"'}, gr = function () {
                            return "\r"
                        }, br = "t", xr = {type: "literal", value: "t", description: '"t"'}, Rr = function () {
                            return "\t"
                        }, wr = 0, Ar = 0, qr = [{line: 1, column: 1, seenCR: !1}], Cr = 0, Er = [], Fr = 0;
                    if ("startRule" in Y) {
                        if (!(Y.startRule in $)) throw new Error("Can't start parsing from rule \"" + Y.startRule + '".');
                        ee = $[Y.startRule]
                    }
                    var kr = require("../flow/utils.js");
                    C.desc = "true", E.desc = "false";
                    var _r = [new RegExp("text/javascript"), new RegExp("application/x-javascript"), new RegExp("application/javascript"), new RegExp("text/css"), new RegExp("image/.*"), new RegExp("application/x-shockwave-flash")];
                    if (F.desc = "is asset", P.desc = "has error", W.desc = "is an HTTP Flow", D.desc = "is marked", G.desc = "has no response", J.desc = "has response", M.desc = "is a TCP Flow", V.desc = "is a Websocket Flow", (X = ee()) !== Z && wr === t.length) return X;
                    throw X !== Z && wr < t.length && s({
                        type: "end",
                        description: "end of input"
                    }), i(null, Er, Cr < t.length ? t.charAt(Cr) : null, Cr < t.length ? n(Cr, Cr + 1) : n(Cr, Cr))
                }
            }
        }();

    }, {"../flow/utils.js": 68}],
    68: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.isValidHttpVersion = exports.parseUrl = exports.ResponseUtils = exports.RequestUtils = exports.MessageUtils = void 0;
        var _lodash = require("lodash"), _lodash2 = _interopRequireDefault(_lodash),
            defaultPorts = {http: 80, https: 443}, MessageUtils = exports.MessageUtils = {
                getContentType: function (e) {
                    var t = this.get_first_header(e, /^Content-Type$/i);
                    if (t) return t.split(";")[0].trim()
                }, get_first_header: function (e, t) {
                    if (e._headerLookups || Object.defineProperty(e, "_headerLookups", {
                        value: {},
                        configurable: !1,
                        enumerable: !1,
                        writable: !1
                    }), !(t in e._headerLookups)) {
                        for (var r, s = 0; s < e.headers.length; s++) if (e.headers[s][0].match(t)) {
                            r = e.headers[s];
                            break
                        }
                        e._headerLookups[t] = r ? r[1] : void 0
                    }
                    return e._headerLookups[t]
                }, match_header: function (e, t) {
                    for (var r = e.headers, s = r.length; s--;) if (t.test(r[s].join(" "))) return r[s];
                    return !1
                }, getContentURL: function (e, t, r) {
                    return t === e.request ? t = "request" : t === e.response && (t = "response"), "./flows/" + e.id + "/" + t + "/" + (r ? "content/" + r + ".json" : "content.data")
                }
            }, RequestUtils = exports.RequestUtils = _lodash2.default.extend(MessageUtils, {
                pretty_url: function (e) {
                    var t = "";
                    return defaultPorts[e.scheme] !== e.port && (t = ":" + e.port), e.scheme + "://" + e.pretty_host + t + e.path
                }
            }), ResponseUtils = exports.ResponseUtils = _lodash2.default.extend(MessageUtils, {}),
            parseUrl_regex = /^(?:(https?):\/\/)?([^\/:]+)?(?::(\d+))?(\/.*)?$/i,
            parseUrl = exports.parseUrl = function (e) {
                var t = parseUrl_regex.exec(e);
                if (!t) return !1;
                var r = t[1], s = t[2], o = parseInt(t[3]), a = t[4];
                r && (o = o || defaultPorts[r]);
                var i = {};
                return r && (i.scheme = r), s && (i.host = s), o && (i.port = o), a && (i.path = a), i
            }, isValidHttpVersion_regex = /^HTTP\/\d+(\.\d+)*$/i,
            isValidHttpVersion = exports.isValidHttpVersion = function (e) {
                return isValidHttpVersion_regex.test(e)
            };

    }, {"lodash": "lodash"}],
    69: [function (require, module, exports) {
        "use strict";

        function _defineProperty(e, r, t) {
            return r in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t, e
        }

        function updateStoreFromUrl(e) {
            var r = window.location.hash.substr(1).split("?", 2), t = _slicedToArray(r, 2), o = t[0], i = t[1],
                l = o.substr(1).split("/");
            if ("flows" === l[0] && 3 == l.length) {
                var n = l.slice(1), a = _slicedToArray(n, 2), s = a[0], u = a[1];
                e.dispatch((0, _flows.select)(s)), e.dispatch((0, _flow.selectTab)(u))
            }
            i && i.split("&").forEach(function (r) {
                var t = r.split("=", 2), o = _slicedToArray(t, 2), i = o[0], l = o[1];
                switch (i) {
                    case Query.SEARCH:
                        e.dispatch((0, _flows.setFilter)(l));
                        break;
                    case Query.HIGHLIGHT:
                        e.dispatch((0, _flows.setHighlight)(l));
                        break;
                    case Query.SHOW_EVENTLOG:
                        e.getState().eventLog.visible || e.dispatch((0, _eventLog.toggleVisibility)());
                        break;
                    default:
                        console.error("unimplemented query arg: " + r)
                }
            })
        }

        function updateUrlFromStore(e) {
            var r, t = e.getState(),
                o = (r = {}, _defineProperty(r, Query.SEARCH, t.flows.filter), _defineProperty(r, Query.HIGHLIGHT, t.flows.highlight), _defineProperty(r, Query.SHOW_EVENTLOG, t.eventLog.visible), r),
                i = Object.keys(o).filter(function (e) {
                    return o[e]
                }).map(function (e) {
                    return e + "=" + o[e]
                }).join("&"), l = void 0;
            l = t.flows.selected.length > 0 ? "/flows/" + t.flows.selected[0] + "/" + t.ui.flow.tab : "/flows", i && (l += "?" + i);
            var n = window.location.pathname;
            "blank" === n && (n = "/"), window.location.hash.substr(1) !== l && history.replaceState(void 0, "", n + "#" + l)
        }

        function initialize(e) {
            updateStoreFromUrl(e), e.subscribe(function () {
                return updateUrlFromStore(e)
            })
        }

        Object.defineProperty(exports, "__esModule", {value: !0});
        var _slicedToArray = function () {
            function e(e, r) {
                var t = [], o = !0, i = !1, l = void 0;
                try {
                    for (var n, a = e[Symbol.iterator](); !(o = (n = a.next()).done) && (t.push(n.value), !r || t.length !== r); o = !0) ;
                } catch (e) {
                    i = !0, l = e
                } finally {
                    try {
                        !o && a.return && a.return()
                    } finally {
                        if (i) throw l
                    }
                }
                return t
            }

            return function (r, t) {
                if (Array.isArray(r)) return r;
                if (Symbol.iterator in Object(r)) return e(r, t);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();
        exports.updateStoreFromUrl = updateStoreFromUrl, exports.updateUrlFromStore = updateUrlFromStore, exports.default = initialize;
        var _flows = require("./ducks/flows"), _flow = require("./ducks/ui/flow"),
            _eventLog = require("./ducks/eventLog"), Query = {SEARCH: "s", HIGHLIGHT: "h", SHOW_EVENTLOG: "e"};

    }, {"./ducks/eventLog": 55, "./ducks/flows": 56, "./ducks/ui/flow": 60}],
    70: [function (require, module, exports) {
        "use strict";

        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {default: e}
        }

        function _classCallCheck(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function _possibleConstructorReturn(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function _inherits(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function reverseString(e) {
            return String.fromCharCode.apply(String, _lodash2.default.map(e.split(""), function (e) {
                return 65535 - e.charCodeAt(0)
            })) + end
        }

        function getCookie(e) {
            var t = document.cookie.match(new RegExp("\\b" + e + "=([^;]*)\\b"));
            return t ? t[1] : void 0
        }

        function fetchApi(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return t.method && "GET" !== t.method ? -1 === e.indexOf("?") ? e += "?" + xsrf : e += "&" + xsrf : e += ".json", e.startsWith("/") && (e = "." + e), fetch(e, _extends({credentials: "same-origin"}, t))
        }

        function getDiff(e, t) {
            var r = _extends({}, t);
            for (var o in e) _lodash2.default.isEqual(t[o], e[o]) ? r[o] = void 0 : "[object Object]" === Object.prototype.toString.call(t[o]) && "[object Object]" === Object.prototype.toString.call(e[o]) && (r[o] = getDiff(e[o], t[o]));
            return r
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.pure = exports.formatTimeStamp = exports.formatTimeDelta = exports.formatSize = exports.Key = void 0;
        var _createClass = function () {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var o = t[r];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, r, o) {
                return r && e(t.prototype, r), o && e(t, o), t
            }
        }(), _extends = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o])
            }
            return e
        };
        exports.reverseString = reverseString, exports.fetchApi = fetchApi, exports.getDiff = getDiff;
        var _lodash = require("lodash"), _lodash2 = _interopRequireDefault(_lodash), _react = require("react"),
            _react2 = _interopRequireDefault(_react);
        window._ = _lodash2.default, window.React = _react2.default;
        for (var Key = exports.Key = {
            UP: 38,
            DOWN: 40,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            LEFT: 37,
            RIGHT: 39,
            ENTER: 13,
            ESC: 27,
            TAB: 9,
            SPACE: 32,
            BACKSPACE: 8,
            SHIFT: 16
        }, i = 65; i <= 90; i++) Key[String.fromCharCode(i)] = i;
        var formatSize = exports.formatSize = function (e) {
            if (0 === e) return "0";
            for (var t = ["b", "kb", "mb", "gb", "tb"], r = 0; r < t.length && !(Math.pow(1024, r + 1) > e); r++) ;
            var o;
            return o = e % Math.pow(1024, r) == 0 ? 0 : 1, (e / Math.pow(1024, r)).toFixed(o) + t[r]
        }, formatTimeDelta = exports.formatTimeDelta = function (e) {
            for (var t = e, r = [1e3, 60, 60], o = 0; Math.abs(t) >= r[o] && o < r.length;) t /= r[o], o++;
            return Math.round(t) + ["ms", "s", "min", "h"][o]
        }, formatTimeStamp = exports.formatTimeStamp = function (e) {
            var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = new Date(1e3 * e);
            if (t) var o = r.getTime() - 60 * r.getTimezoneOffset() * 1e3,
                n = new Date(o).toISOString(); else n = r.toISOString();
            return n.replace("T", " ").replace("Z", "")
        }, end = String.fromCharCode(65535), xsrf = "_xsrf=" + getCookie("_xsrf");
        fetchApi.put = function (e, t, r) {
            return fetchApi(e, _extends({
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(t)
            }, r))
        };
        var pure = exports.pure = function (e) {
            var t, r;
            return r = t = function (t) {
                function r() {
                    return _classCallCheck(this, r), _possibleConstructorReturn(this, (r.__proto__ || Object.getPrototypeOf(r)).apply(this, arguments))
                }

                return _inherits(r, _react2.default.PureComponent), _createClass(r, [{
                    key: "render",
                    value: function () {
                        return e(this.props)
                    }
                }]), r
            }(), t.displayName = e.name, r
        };

    }, {"lodash": "lodash", "react": "react"}]
}, {}, [1])

//# sourceMappingURL=app.js.map
