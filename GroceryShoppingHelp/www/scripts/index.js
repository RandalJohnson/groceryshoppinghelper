
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

            $("#cost").val(cost.toFixed(2));


        });


});
