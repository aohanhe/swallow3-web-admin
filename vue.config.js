module.exports = {
    devServer: {
        port: 9000
    },
    css: {
        loaderOptions: {
            // 向 CSS 相关的 loader 传递选项      
            less: {
                javascriptEnabled: true
            }
        }
    }
}