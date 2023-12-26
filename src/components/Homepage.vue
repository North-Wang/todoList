<template>
  <form class="max-w-[275px] my-8 lg:max-w-[400px] dark:text-[#213547]">
    <input
      type="text"
      class="search dark:bg-white"
      placeholder="City or State"
      v-model="keyword"
    />
    <div class="p-0 m-0 relative">
      <ul v-if="keyword === ''" class="suggestions overflow-hidden">
        <li>Filter for a city</li>
        <li>or a state</li>
      </ul>
      <ul v-else class="suggestions">
        <li class="flex justify-center" v-if="searchResultList.length === 0">
          no cities match
        </li>
        <li
          v-for="place in searchResultList"
          :key="place"
          class="flex justify-between"
          v-if="searchResultList.length != 0"
        >
          <ul v-html="place.html" class="city-place-name"></ul>
          <ul>
            {{
              parseInt(place.population)?.toLocaleString()
            }}
          </ul>
        </li>
      </ul>
      <ul
        class="flex justify-center mt-4"
        v-if="
          keyword != '' &&
          allSearchResultList.length != 0 &&
          searchResultList.length < allSearchResultList.length
        "
      >
        <img
          :src="moreOptionBlack"
          alt="more option"
          class="bg-white w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer opacity-90"
          @click="getMoreData"
        />
      </ul>
    </div>
  </form>
</template>

<script setup>
import { ref, toRefs, watch, onMounted, computed, defineProps } from "vue";
import { storeToRefs } from "pinia";
import { usePlaceData } from "../store/usePlaceData.js";

//picture
import moreOptionBlack from "../assets/moreOptionBlack.svg";

const deviceInfo = navigator.userAgent;
const isPhone = ref(/mobile/i.test(deviceInfo));
const placeData = usePlaceData();
const { allPlaceData } = storeToRefs(placeData);

const allPlaceList = ref([]);
const keyword = ref("");
const allSearchResultList = ref([]);
const searchResultList = ref([]);
const cacheResult = ref(new Map()); //save the result which had filtered，avoid repeatedly call api to influence performance
const regex = ref("");
const getCity = async function () {
  const url =
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";
  try {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("get all city data", data);
        allPlaceList.value = data;
        placeData.allPlaceData = data;
      });
  } catch (err) {
    console.warn("連線有誤", err);
    allPlaceList.value = [];
    placeData.allPlaceData = [];
  }
};

const debounce = (fn, delay = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const searchCity = async function (keyword) {
  // const regex = new RegExp(keyword, "gi");

  //check if there had cache data
  const cacheData = checkCacheAndReturn(keyword);
  if (cacheData) {
    allSearchResultList.value = cacheData;
    searchResultList.value = allSearchResultList.value.slice(0, 10);
    highLightKeyword();
    return;
  }

  //filtering if no cache data
  allSearchResultList.value = allPlaceList.value.filter((place) => {
    return place.city.match(regex.value) || place.state.match(regex.value);
  });
  const range = isPhone.value ? 8 : 10;
  searchResultList.value = allSearchResultList.value.slice(0, range);
  await highLightKeyword();

  //save cache data
  saveCache(keyword, allSearchResultList.value);
};

const debounceSearchCity = debounce((keyword) => {
  searchCity(keyword);
}, 500);

const highLightKeyword = () => {
  searchResultList.value.forEach((place) => {
    const cityMatchText = place.city.match(regex.value);
    let cityHtml = place.city;
    if (cityMatchText) {
      cityHtml = place.city
        .toLowerCase()
        .replace(
          cityMatchText[0].toLowerCase(),
          `<span class='bg-yellow-400'>${cityMatchText[0]}</span>`
        );
    }

    const stateMatchText = place.state.match(regex.value);
    let stateHtml = place.state;
    if (stateMatchText) {
      stateHtml = place.state
        .toLowerCase()
        .replace(
          stateMatchText[0].toLowerCase(),
          `<span class='bg-yellow-400'>${stateMatchText[0]}</span>`
        );
    }

    place.html = `<span>${cityHtml},${stateHtml}</span>`; //add <span> to avoid first letter to uppercase
  });
};

const saveCache = (keyword, newData) => {
  if (cacheResult.value[keyword] === undefined) {
    cacheResult.value[keyword] = newData;
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

const getMoreData = () => {
  if (searchResultList.value.length >= allSearchResultList.value.length) {
    return;
  }
  const range = isPhone.value ? 8 : 10;
  const newStartIndex = searchResultList.value.length;
  const newPlaceList = allSearchResultList.value.slice(
    newStartIndex,
    newStartIndex + range
  );

  searchResultList.value = searchResultList.value.concat(newPlaceList);
  highLightKeyword();
};

watch(keyword, async function (keyword) {
  if (keyword != "") {
    regex.value = new RegExp(keyword, "gi");
    debounceSearchCity(keyword);
  }
});

onMounted(() => {
  if (Object.values(allPlaceData.value).length === 0) {
    //if Pinia no cache data
    getCity();
  } else {
    allPlaceList.value = allPlaceData.value;
  }
});
</script>

<style scoped>
.search {
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
