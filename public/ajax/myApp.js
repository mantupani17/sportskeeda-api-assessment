(function($){
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
})(jQuery);

var app = {   
    getApiData: function(){
        return $.ajax({
            url:'/json-data',
            type:'GET',
            dataType:'json'
        })
    },

    getPaginationData: function(data){
        return $.ajax({
            url:'/paginate',
            type:'GET',
            dataType:'json',
            data:data
        })
    }
}