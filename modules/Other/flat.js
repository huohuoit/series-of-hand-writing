/*
 * @Author: huohuoit
 * @Date: 2021-04-19 16:59:38
 * @Description: Get it !
 * @LastEditors: huohuoit
 * @LastEditTime: 2021-04-19 20:35:56
 * @Github: https://github.com/Qingxuan001
 * @FilePath: \series-of-hand-writing\modules\Other\flat.js
 */

// 传入两个参数：数组arr  扁平化层数depth（默认是一层）
function flat (arr, depth = 1) {
    return depth > 0 ?  // 层数大于0才进行扁平化
        arr.reduce((acc, cur) => {  // acc：reducer 函数的返回值（累计器），cur：当前值（arr 中遍历到的当前元素值）
            if (Array.isArray(cur)) {  // 当前值是 数组
                return [...acc, ...flat(cur, depth - 1)];  // 递归执行 flat 函数，插入返回数组中 累计器的值后面
            }
            return [...acc, cur];   // 当前值不是数组，直接插入返回数组中 累计器后面
        }, [])
        : arr // 扁平化层数小于等于0，直接返回原数组 arr
}