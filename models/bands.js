class Bands{
    constructor(){
        this.bands = [];
    }
    
    addBand(band = Band()){
        this.bands.push(band);
    }

    getBands(){
        return this.bands;
    }

    deleteBand(id){
        this.bands = this.bands.filter(band => band.id !== id);
        return this.bands;
    }
    voteBand(id){
       this.bands = this.bands.map(band => {
        if (band.id === id) {
            band.votes += 1;
        }
        return band;
       });
    }

    updateBand(id, name){
        const band = this.bands.find(band => band.id === id);
        if (band) {
            band.name = name;
        }
    }


}

module.exports = Bands;