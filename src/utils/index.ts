import axios from "axios";

export function updateQueryParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url);
}

export function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

export class LRUCache {
  #length;
  #cache;
  constructor(length = 10) {
    this.#length = length;
    this.#cache = new Map();
    this.clearCacheLoop();
  }

  clearCacheLoop() {
    this.#cache.forEach((value, key) => {
      const [, timeSamp] = value;
      if (Date.now() > timeSamp) {
        this.#cache.delete(key);
      }
    });
    requestAnimationFrame(() => {
      this.clearCacheLoop();
    });
  }

  get(key) {
    if (!this.#cache.has(key)) {
      return;
    }
    const [value, timeSamp] = this.#cache.get(key);
    this.#cache.delete(key);
    this.#cache.set(key, [value, timeSamp]);
    return value;
  }

  set(key, value, expireTime = 60) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    }
    if (this.#cache.size === this.#length) {
      this.#cache.delete(this.#cache.keys().next().value);
    }
    this.#cache.set(key, [value, Date.now() + expireTime * 1000]);
  }
}
// https://api.github.com/search/repositories?q=stars%3A%3E1&sort=stars&order=desc&type=Repositories&page=1&per_page=10
export class Api {
  #cache;
  constructor(baseURL = "https://api.github.com/") {
    this.#cache = new LRUCache(10);
    this.axios = axios.create({
      baseURL,
    });
    // 添加响应拦截器
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        console.log("error: ", error);
        window.alert(error.message);
        return Promise.reject(error);
      }
    );
  }
  async fetch(params) {
    const key = JSON.stringify(params);
    const cacheData = this.#cache.get(key);
    if (cacheData) {
      return cacheData;
    }
    const res = await this.axios(params);
    this.#cache.set(key, res);
    return res;
  }
  // https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&type=Repositories&page=1&per_page=1
  async getRepositories(query) {
    const { page, per_page, q, sort, order, type } = query;
    const res = await this.fetch({
      url: "/search/repositories",
      params: {
        page,
        per_page,
        q,
        sort,
        order,
        type,
      },
    });
    return res;
  }
}

export const api = new Api();
