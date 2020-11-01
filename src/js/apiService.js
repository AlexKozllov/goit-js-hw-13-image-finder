export default {
    baseUrl: "https://pixabay.com/api/?image_type=photo&orientation=horizontal",
    query: "",
    page: 1,
    per_page: 12,
    key: "18823692-f69edaabddb6a9bc41c7d0ed3",
    
    async getData() {
        try {
            let url = `${this.baseUrl}&q=${this.query}&page=${this.page}&per_page=${this.per_page}&key=${this.key}`;
          const response = await fetch(url);
          const data = await response.json();
          if (data.total === 0) {
              return data.total
          }
          return data.hits  
        } catch (err) {
            throw err
     }
    },
    
    newSetPage() {
        this.page += 1;
        return `${this.baseUrl}&q=${this.query}&page=${this.page}&per_page=${this.per_page}&key=${this.key}`
    },

        resetPage() {
        return this.page = 1;
    },
        
}
