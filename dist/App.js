"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./App.css");
var _module = require("./utils/module");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var STORAGE_KEY = "registeredUsers";
var EMPTY_FORM = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: ""
};
var FIELDS = Object.keys(EMPTY_FORM);
function loadRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_unused) {
    return [];
  }
}
function App() {
  var _useState = (0, _react.useState)(EMPTY_FORM),
    _useState2 = _slicedToArray(_useState, 2),
    formData = _useState2[0],
    setFormData = _useState2[1];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    errors = _useState4[0],
    setErrors = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    toaster = _useState6[0],
    setToaster = _useState6[1];
  var _useState7 = (0, _react.useState)(loadRegisteredUsers),
    _useState8 = _slicedToArray(_useState7, 2),
    registeredUsers = _useState8[0],
    setRegisteredUsers = _useState8[1];
  var handleChange = function handleChange(e) {
    var _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    setFormData(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, value));
    });
    setErrors(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, (0, _module.getFieldError)(name, value)));
    });
  };
  var isFormValid = FIELDS.every(function (f) {
    return formData[f] && !(0, _module.getFieldError)(f, formData[f]);
  });
  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    var newList = [].concat(_toConsumableArray(registeredUsers), [formData]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    setRegisteredUsers(newList);
    setFormData(EMPTY_FORM);
    setErrors({});
    setToaster(true);
    setTimeout(function () {
      return setToaster(false);
    }, 3000);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "App",
    children: [toaster && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      role: "alert",
      "data-testid": "toaster",
      style: {
        background: "green",
        color: "white",
        padding: "12px 20px",
        marginBottom: "16px",
        borderRadius: "4px"
      },
      children: "Inscription r\xE9ussie !"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      children: "Inscription"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
      onSubmit: handleSubmit,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "lastName",
          children: "Nom :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "lastName",
          type: "text",
          name: "lastName",
          value: formData.lastName,
          onChange: handleChange
        }), errors.lastName && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-lastName",
          style: {
            color: "red"
          },
          children: errors.lastName
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "firstName",
          children: "Pr\xE9nom :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "firstName",
          type: "text",
          name: "firstName",
          value: formData.firstName,
          onChange: handleChange
        }), errors.firstName && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-firstName",
          style: {
            color: "red"
          },
          children: errors.firstName
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "email",
          children: "Mail :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "email",
          type: "text",
          name: "email",
          value: formData.email,
          onChange: handleChange
        }), errors.email && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-email",
          style: {
            color: "red"
          },
          children: errors.email
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "birthDate",
          children: "Date de naissance :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "birthDate",
          type: "date",
          name: "birthDate",
          value: formData.birthDate,
          onChange: handleChange
        }), errors.birthDate && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-birthDate",
          style: {
            color: "red"
          },
          children: errors.birthDate
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "city",
          children: "Ville :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "city",
          type: "text",
          name: "city",
          value: formData.city,
          onChange: handleChange
        }), errors.city && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-city",
          style: {
            color: "red"
          },
          children: errors.city
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "postalCode",
          children: "Code postal :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "postalCode",
          type: "text",
          name: "postalCode",
          value: formData.postalCode,
          onChange: handleChange
        }), errors.postalCode && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-testid": "error-postalCode",
          style: {
            color: "red"
          },
          children: errors.postalCode
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        type: "submit",
        "data-testid": "submit-btn",
        disabled: !isFormValid,
        children: "Sauvegarder"
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      children: "Liste des inscrits"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      "data-testid": "registeredUsers-list",
      children: registeredUsers.map(function (u, i) {
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)("li", {
          "data-testid": "registeredUser-".concat(i),
          children: [u.firstName, " ", u.lastName, " \u2014 ", u.email]
        }, i);
      })
    })]
  });
}
var _default = exports["default"] = App;