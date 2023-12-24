<template>
  <form class="search-form">
    <input
      type="text"
      class="search"
      placeholder="City or State"
      v-model="keyword"
    />
    <ul class="suggestions">
      <div v-if="keyword === ''" class="default-city-list">
        <li>Filter for a city</li>
        <li>or a state</li>
      </div>
      <div v-else class="city-list">
        <li class="justify-center" v-if="resultCityList.length === 0">
          no match cities
        </li>
        <li
          v-for="citys in resultCityList"
          :key="citys"
          class="flex justify-between"
          v-if="resultCityList.length != 0"
        >
          <div>{{ citys.city }}</div>
          <div>{{ parseInt(citys.population)?.toLocaleString() }}</div>
        </li>
      </div>
    </ul>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, computed, defineProps } from "vue";
import axios from "axios";

const allCityList = ref([]);
const backupAllCity = ref([]);
const keyword = ref("");
const resultCityList = ref([]);
const cacheResult = ref(new Map()); //儲存已經搜尋過的結果，避免重複運算，影響效能
const getCity = async function (params) {
  const url =
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";
  try {
    axios.get(url).then((result) => {
      console.log("result", result);
      allCityList.value = result.data;
      backupAllCity.value = allCityList.value;
    });
  } catch (err) {
    console.warn("連線有誤", err);
    allCityList.value = [];
    backupAllCity.value = [];
  }
};

const searchCity = async function (keyword) {
  console.log("搜尋", keyword);
  if (checkCacheAndReturn(keyword) != undefined) {
    resultCityList.value = checkCacheAndReturn(keyword);
    return;
  }
  resultCityList.value = allCityList.value.filter((city) => {
    return city.city.includes(keyword);
  });
  if (resultCityList.value.length !== 0) {
    saveCache(keyword, resultCityList.value);
  }
};

const saveCache = (keyword, result) => {
  if (cacheResult.value[keyword] === undefined) {
    cacheResult.value[keyword] = result;
  }
};
const checkCacheAndReturn = (keyword) => {
  if (cacheResult.value[keyword] != undefined) {
    console.log("使用快取資料");
    return cacheResult.value[keyword];
  } else {
    return undefined;
  }
};
watch(
  keyword,
  async function (keyword) {
    if (keyword != "") {
      searchCity(keyword);
    }
  },
  200
);

onMounted(() => {
  getCity();
});
</script>

<style scoped>
.search-form {
  max-width: 400px;
  margin: 50px auto;
}
.search-form .search {
  margin: 0;
  text-align: center;
  outline: 0;
  border: 10px solid #f7f7f7;
  width: 120%;
  left: -10%;
  position: relative;
  top: 10px;
  z-index: 2;
  border-radius: 5px;
  font-size: 40px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.19);
}
.suggestions {
  margin: 0;
  padding: 0;
  position: relative;
  /*perspective:20px;*/
}
.suggestions li {
  background: white;
  list-style: none;
  border-bottom: 1px solid #d8d8d8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.14);
  margin: 0;
  padding: 20px;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
}

.default-city-list li:nth-child(even),
.city-list > li:nth-child(even) {
  transform: perspective(100px) rotateX(3deg) translateY(2px) scale(1.001);
  background: linear-gradient(to bottom, #ffffff 0%, #efefef 100%);
}
.default-city-list li:nth-child(odd),
.city-list > li:nth-child(odd) {
  transform: perspective(100px) rotateX(-3deg) translateY(3px);
  background: linear-gradient(to top, #ffffff 0%, #efefef 100%);
}
</style>
