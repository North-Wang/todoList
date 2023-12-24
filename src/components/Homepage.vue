<template>
  <form class="search-form">
    <input
      type="text"
      class="search"
      placeholder="City or State"
      v-model="keyword"
    />
    <div class="p-0 m-0 relative">
      <ul v-if="keyword === ''" class="suggestions">
        <li>Filter for a city</li>
        <li>or a state</li>
      </ul>
      <ul v-else class="suggestions">
        <li class="flex justify-center" v-if="resultCityList.length === 0">
          no cities match
        </li>
        <li
          v-for="place in resultCityList"
          :key="place"
          class="flex justify-between"
          v-if="resultCityList.length != 0"
        >
          <span v-html="place.html" class="city-place-name"></span>
          <ul>
            {{
              parseInt(place.population)?.toLocaleString()
            }}
          </ul>
        </li>
      </ul>
    </div>
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
      console.log("get all city data", result);
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
  //   if (checkCacheAndReturn(keyword) != undefined) {
  //     resultCityList.value = checkCacheAndReturn(keyword);
  //     return;
  //   }

  //filtering if no cache data
  const regex = new RegExp(keyword, "gi");
  resultCityList.value = allCityList.value.filter((place) => {
    return place.city.match(regex) || place.state.match(regex);
  });

  await highLightKeyword(keyword, regex);

  //save cache data
  if (resultCityList.value.length !== 0) {
    saveCache(resultCityList.value);
  }
};

const highLightKeyword = (regex) => {
  resultCityList.value.forEach((place) => {
    const cityMatchText = place.city.match(regex);
    let cityHtml = place.city;
    if (cityMatchText) {
      cityHtml = place.city
        .toLowerCase()
        .replace(
          cityMatchText[0].toLowerCase(),
          `<span class='bg-yellow-400'>${cityMatchText[0]}</span>`
        );
    }

    const stateMatchText = place.state.match(regex);
    let stateHtml = place.state;
    if (stateMatchText) {
      stateHtml = place.state
        .toLowerCase()
        .replace(
          stateMatchText[0].toLowerCase(),
          `<span class='bg-yellow-400'>${stateMatchText[0]}</span>`
        );
    }

    place.html = `<span>${cityHtml},${stateHtml}</span>`; //add <span> to avolid first letter to uppercase
  });
};

const saveCache = (keyword, result) => {
  if (cacheResult.value[keyword] === undefined) {
    cacheResult.value[keyword] = result;
  }
};
const checkCacheAndReturn = (keyword) => {
  if (cacheResult.value[keyword] != undefined) {
    //had cache data
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
.suggestions > li {
  list-style: none;
  border-bottom: 1px solid #d8d8d8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.14);
  margin: 0;
  padding: 20px;
  transition: background 0.2s;
  display: flex;
  text-transform: capitalize;
}

.suggestions > li:nth-child(even) {
  transform: perspective(100px) rotateX(3deg) translateY(2px) scale(1.001);
  background: linear-gradient(to bottom, #ffffff 0%, #efefef 100%);
}
.suggestions > li:nth-child(odd) {
  transform: perspective(100px) rotateX(-3deg) translateY(3px);
  background: linear-gradient(to top, #ffffff 0%, #efefef 100%);
}
/* :deep(.city-place-name) {
  text-transform: none;
} */
</style>
