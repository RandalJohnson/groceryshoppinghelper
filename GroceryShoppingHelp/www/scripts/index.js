
$(document).ready(function () {

        $('form').on('focus', 'input[type=number]', function(e) {
            $(this).on('wheel', function(e) {
                e.preventDefault();
            });
        });
        $("#calc").click(function () {
            var price = $("#price").val();
            var pounds = $("#pounds").val();
            var ounces = pounds * 16;
            var cost = price / ounces;

            $("#cost").val(cost.toFixed(3));


        });
        $("#bottlecalc").click(function () {
            var bottleprice = $("#bottleprice").val();
            var bottlecount = $("#bottlecount").val();
            var bottlevolume = $("#bottlevolume").val();
            var bottletotalvolume = bottlecount * bottlevolume;
            var bottlecost = bottleprice / bottletotalvolume;

            $("#bottlecost").val(bottlecost.toFixed(3));


        });


});
