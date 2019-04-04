"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ReadLockedNodeInMem = /** @class */ (function () {
    function ReadLockedNodeInMem(path, tree) {
        this.path = path;
        this.tree = tree;
    }
    ReadLockedNodeInMem.prototype.release = function () {
    };
    ReadLockedNodeInMem.prototype.exists = function () {
        return (Object.keys(this.tree.kv).indexOf(this.path) !== -1);
    };
    return ReadLockedNodeInMem;
}());
var ReadLockedContainerInMem = /** @class */ (function (_super) {
    __extends(ReadLockedContainerInMem, _super);
    function ReadLockedContainerInMem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadLockedContainerInMem.prototype.getDescendents = function () {
        var _this = this;
        return Object.keys(this.tree.kv).filter(function (x) {
            return (x.substr(0, _this.path.length) == _this.path);
        });
    };
    ReadLockedContainerInMem.prototype.getMembers = function () {
        var list = this.getDescendents();
        // TODO: only report directly contained members
        // but don't forget
        console.log('getMembers', this.path, this.tree.kv, list);
        return Promise.resolve(list);
    };
    return ReadLockedContainerInMem;
}(ReadLockedNodeInMem));
var ReadWriteLockedContainerInMem = /** @class */ (function (_super) {
    __extends(ReadWriteLockedContainerInMem, _super);
    function ReadWriteLockedContainerInMem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadWriteLockedContainerInMem.prototype["delete"] = function () {
        var _this = this;
        this.getDescendents().map(function (x) {
            delete _this.tree.kv[x];
        });
        return Promise.resolve();
    };
    ReadWriteLockedContainerInMem.prototype.reset = function () {
        this.tree.kv[this.path + '.placeholder'] = undefined; // basically same trick git uses for empty folders
        return Promise.resolve();
    };
    return ReadWriteLockedContainerInMem;
}(ReadLockedContainerInMem));
var ReadLockedResourceInMem = /** @class */ (function (_super) {
    __extends(ReadLockedResourceInMem, _super);
    function ReadLockedResourceInMem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadLockedResourceInMem.prototype.getData = function () {
        return Promise.resolve(this.tree[this.path]);
    };
    return ReadLockedResourceInMem;
}(ReadLockedNodeInMem));
var ReadWriteLockedResourceInMem = /** @class */ (function (_super) {
    __extends(ReadWriteLockedResourceInMem, _super);
    function ReadWriteLockedResourceInMem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReadWriteLockedResourceInMem.prototype.setData = function (data) {
        this.tree[this.path] = data;
        return Promise.resolve();
    };
    ReadWriteLockedResourceInMem.prototype["delete"] = function () {
        delete this.tree[this.path];
        return Promise.resolve();
    };
    ReadWriteLockedResourceInMem.prototype.reset = function () {
        this.tree.kv[this.path] = undefined;
        return Promise.resolve();
    };
    return ReadWriteLockedResourceInMem;
}(ReadLockedResourceInMem));
var AtomicTreeInMem = /** @class */ (function () {
    function AtomicTreeInMem() {
        this.kv = {};
        console.log('constructed in-mem store', this.kv);
    }
    AtomicTreeInMem.prototype.getReadLockedContainer = function (path) {
        return new ReadLockedContainerInMem(path, this);
    };
    AtomicTreeInMem.prototype.getReadWriteLockedContainer = function (path) {
        return new ReadWriteLockedContainerInMem(path, this);
    };
    AtomicTreeInMem.prototype.getReadLockedResource = function (path) {
        return new ReadLockedResourceInMem(path, this);
    };
    AtomicTreeInMem.prototype.getReadWriteLockedResource = function (path) {
        return new ReadWriteLockedResourceInMem(path, this);
    };
    AtomicTreeInMem.prototype.on = function (eventName, eventHandler) {
        //TODO: implement
        console.log('adding event handler', eventName, eventHandler);
    };
    return AtomicTreeInMem;
}());
exports["default"] = AtomicTreeInMem;
