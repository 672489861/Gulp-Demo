(function (win) {

    /***
     * 声明TreeNode数据类型
     * @param node
     * @constructor
     */
    var TreeNode = function (node) {
        this.id = node.id;
        this.pId = node.pId;
        this.data = node.data;
        this.children = node.children;
        this.parent = node.parent;
    };

    /***
     * 获取当前节点的数据
     * @returns {*}
     */
    TreeNode.prototype.getData = function () {
        return this.data;
    };

    /***
     * 获取当前节点的子节点
     * @returns {Array|*}
     */
    TreeNode.prototype.getChildren = function () {
        return this.children;
    };


    /***
     * 获取某节点的父节点,如无父节点则返回null
     */
    TreeNode.prototype.getParent = function () {
        return this.parent;
    };

    /***
     * 获取某节点的父辈节点集合,注:顺序是倒序
     */
    TreeNode.prototype.getParents = function () {
        var parents = [],
            node = this.parent;

        while (node) {
            parents.push(node);
            node = node.getParent();
        }
        return parents;
    };

    var Tree = function (options) {
        this.idField = options && options.idField ? options.idField : 'id';
        this.pIdField = options && options.pIdField ? options.pIdField : 'pid';
        this._treeNodeData = [];
        this._hashTreeData = [];
        this.listToTree(options.data);

        //设置此节点,标识树结构下的数据需要排序
        this.sortField = options && options.sortField ? options.sortField : "";
        //确认是否需要排序
        if (this.sortField) {
            this.sortTree(this.sortField);
        }
    };

    /***
     * 获取所有的数据集合
     * @returns {Array} TreeNode 类型
     */
    Tree.prototype.getNodes = function () {
        return this._treeNodeData;
    };

    /***
     * @param id 根据id获取对应节点数据
     * @returns {TreeNode} 查询到返回节点示例,查询不到返回null
     */
    Tree.prototype.getNode = function (id) {
        var treeNode = this._hashTreeData[id];
        return treeNode ? treeNode : null;
    };

    Tree.prototype.listToTree = function (data) {
        var nodes = this.transformData(data),
            r = this._treeNodeData,
            hash = this._hashTreeData,
            i = 0, j = 0,
            len = nodes.length;

        for (; i < len; i++) {
            hash[nodes[i].id] = nodes[i];
        }

        for (; j < len; j++) {
            var node = nodes[j],
                pNode = hash[node.pId];

            if (pNode) {
                node.parent = pNode;
                pNode.children.push(node);
            } else {
                r.push(node);
            }
        }
    };

    Tree.prototype.makeNode = function (data) {
        var idField = this.idField,
            pIdField = this.pIdField;

        var node = {
            id: data[idField],
            pId: data[pIdField],
            data: data,
            children: [],
            parent: null
        };
        return new TreeNode(node);
    };

    Tree.prototype.transformData = function (data) {
        var i = 0,
            len = data.length,
            r = [];

        for (; i < len; i++) {
            r.push(this.makeNode(data[i]));
        }
        return r;
    };

    /***
     *  对树进行排序
     *  1.先对顶层节点进行排序（原因是顶层节点可能不为一个，并且他们没有父节点,所以只能单独排序）
     *  2.在对每一个节点下递归调用子节点的sortChildren方法
     * @param sortFieldParam 默认是用户初始化时传入的参数,如用户传入额外参数以额外参数为准
     */
    Tree.prototype.sortTree = function (sortFieldParam) {
        var nodes = this._treeNodeData,
            sortField = sortFieldParam ? sortFieldParam : this.sortField;

        _SortTree(nodes, sortField);
    };

    function _SortTree(nodes, sortField) {
        nodes.sort(function (node1, node2) {
            return node1.getData()[sortField] - node2.getData()[sortField];
        });
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].getChildren().length > 0) {
                _SortTree(nodes[i].getChildren(), sortField);
            }
        }
    };

    win.YTM.Util.Tree = Tree;

})(window);