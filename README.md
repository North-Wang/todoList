專案網址：https://wilson-todo-list.vercel.app/#/

![image](https://github.com/North-Wang/todoList/assets/103781180/2a91e212-a411-4eb6-a972-a7e5b954e742)

專案介紹：
1. 根據https://codepen.io/tariso/pen/LyoaRM JavaScript 30 Day 6 Ajax Type Ahead的範例製作與部分優化
2. 主要以使用Vue.js + Vite + Tailwind.css + Pinia開發，搭配Versel部屬網站。
   * 考量到快速開發且不想直接修改style，所以使用Tailwind.css，而且其方便設定RWD、dark mode
   * Pinia和相關套件，能儲存api的資料，在條件沒變的情況下，不用重複call api
3. 設計細節：
  * 考慮到資料量大的狀況，因此一次只會顯示前幾筆文字(電腦版、手機板一次顯示的筆數不同)，當點選"更多選項"的時候才會顯示更多資料。
    之所以新增一個"更多選項"的按鈕，是因為原本的搜尋結果UI不適合出現滾動軸，所以要設計一個按鈕讓使用者知道還有更多資料，
    甚至可以設計"回到頂部"的按鈕，方便回到搜尋框的位置。
  * 搜尋框的防抖功能。輸入完過500毫秒如果沒有再更新文字，才會進行搜尋 -> 避免還在輸入關鍵字的時候就開始跑搜尋
  * 用new Map()儲存已搜尋的結果，key為關鍵字；value為搜尋結果(Object)
  * call api時使用try...catch，如果連線錯誤會有console.warn()訊息以及錯誤處裡
  * 搜尋欄清空時，list會恢復成初始狀態
  * 有設計無匹配結果時會顯示的文字
  * 有設計RWD，還有考量dark mode的情況
  
  
