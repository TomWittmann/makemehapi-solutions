module.exports = function(context) {
    let query = context.data.root.query;
    return query.name + query.suffix;
};