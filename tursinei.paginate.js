/**
 * A jquery plugin Pagination integrated with laravel paginate function via ajax .
 * Copyright (c) 2022 Velly tursinei;
 * Version 1.2.0
 */
(function ($) {
    let defaultSetting = {
        numbering: true,
        useButtons: true,
        searching: true,
        cols: [],
        colId: "",
        url: window.location.href,
        data: {},
        state: true,
        simple: false,
        reload: false,
        classBtnUpdate: "btn btn-xs btn-info btn-update",
        classBtnDelete: "btn btn-xs btn-danger btn-delete",
        searchPlaceholder : 'Search...',
        onReady : null,
        onError : null,
        onAlways: null,
        onPageClick : null,
    };

    let keyPrefix = '_tPaginate';

    let methods =  {
        init : function (options) {
            return this.each(function() {
                var setting = $.extend({}, defaultSetting, options || {});
                if (setting.url == "") {
                    throw 'Key url Undefined';
                }

                let TABLE = $(this);
                if (setting.colId == "" && setting.useButtons) {
                    throw 'Key colId as column name of primary key from table Undefined, as long as Key useButtons is true ';
                }

                let divScrollable = TABLE.parent(".table-scrollable");
                if (divScrollable.length == 0) {
                    divScrollable = TABLE.wrap('<div class="table-scrollable"></div>').parent();
                }
                $(this).data(keyPrefix, setting);
                getInitData(setting,divScrollable, TABLE);
            })
        },
        reload :  function () {
            return this.each(function() {
                let TABLE = $(this);
                var settings = TABLE.data(keyPrefix);
                settings.reload = true;
                let divScrollable = TABLE.parent(".table-scrollable");
                let aActive = divScrollable
                    .next("div.row")
                    .find("ul.pagination > li.active > a");
                if(aActive.length == 1){
                    aActive.trigger('click');
                }else {
                    getInitData(settings,divScrollable, TABLE);
                }
            });
        }
    };

    function getInitData(setting,divScrollable,TABLE){
        $.ajax({
            data : setting.data,
            url : setting.url,
            dataType : 'JSON',
            headers : {
                'tpaginate' : 'initial-table'
            },
            success : function(res) {
                if (setting.searching) {
                    genCari(divScrollable, TABLE);
                }
                generateTr(res, TABLE);
                genPages(divScrollable, res, TABLE);
                if (typeof setting.onReady == 'function'){
                    setting.onReady(TABLE);
                }
            },
            error : function(res, status, message) {
                if (typeof setting.onError == 'function'){
                    setting.onError(res,status, message);
                } else {
                    alert(res.responseText);
                }
            }
        }).always(function(res) {
            if (typeof setting.onAlways == 'function'){
                setting.onAlways(res);
            }
        });
    }


    $.fn.tPaginate = function (method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tPaginate' );
        }
    };

    function generateTr(e, TABLE) {
        let tr = "",
            no = e.from;
        let setting = $(TABLE).data(keyPrefix);
        e.data.forEach((obj) => {
            let trObj = $("<tr></tr>");
            if (setting.numbering) {
                let td = $("<td></td>").text(no).addClass("text-center");
                trObj.append(td[0].outerHTML);
            }
            setting.cols.forEach((column) => {
                let td = $("<td></td>").appendTo(trObj);
                if (typeof column == "object") {
                    td.html(obj[column.key]).addClass(column.class);
                    // dihilangkan soalnya sama saja dengan column is function
                    // if(typeof column.custom == 'function'){
                    //     td.html(column.custom(obj[column.key],trOj));
                    // }
                } else if(typeof column == 'function'){
                    td.html(column(obj, td)); // if column is function
                } else {
                    td.text(obj[column]);
                }
            });
            if (setting.useButtons) {
                let btnEdit = '<button type="button" data-id="'+obj[setting.colId]+'" class="'+
                            setting.classBtnUpdate+'" ><i class="fa fa-pencil"></i></button>';
                let btnDel = '<button type="button" data-id="'+obj[setting.colId]+'" class="'+
                            setting.classBtnDelete+'" ><i class="fa fa-trash"></i></button>';
                let td = $("<td></td>")
                    .html(btnEdit + "&nbsp;" + btnDel)
                    .addClass("text-center");
                trObj.append(td[0].outerHTML);
            }
            tr += trObj[0].outerHTML;
            no++;
        });
        if(tr == ''){
            let cols = setting.cols.length;
            if(setting.numbering){
                cols++;
            }
            if(setting.useButtons){
                cols++;
            }
            tr = '<tr><td class="text-center" colspan="'+cols+'">There is no data available</td></tr>';
        }
        let tbody = TABLE.find("tbody");
        if (tbody.length == 0) {
            $("<tbody></tbody>").html(tr);
        } else {
            tbody.html(tr);
        }
    }

    function genCari(divScrollable, TABLE) {
        let divCari = divScrollable.prev("div.row").find("div.div-search");
        let setting = $(TABLE).data(keyPrefix);
        if (divCari.length == 0) {
            divCari = $("<div></div>").addClass("col-md-12 div-search text-end");
            let sField = $('<input id="tPaginate-search">')
                .addClass("form-control form-control-sm mb-2")
                .attr("placeholder", setting.searchPlaceholder);
            sField.on("input", debounce(function(){
                let data = setting.data; //{ tsearch: this.value };
                data.tsearch = this.value;
                $.ajax({
                    url: setting.url,
                    dataType: "JSON",
                    data: data,
                    headers: {
                        tpaginate: "searching",
                    },
                    success: function (res) {
                        generateTr(res, TABLE);
                        genPages(divScrollable, res, TABLE);
                    },
                });
            },500));
            $("<label></label>").append(sField).appendTo(divCari);
            let divRow = $('<div class="row"></div>').append(divCari);
            divRow.insertBefore(divScrollable);
        }
    }

    function debounce(func, delay){
        let timer;
        return function(){
            const context = this;
            const args = arguments;

            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        }
    }

    function genPages(divScrollable, resPaginate, TABLE) {
        let setting = $(TABLE).data(keyPrefix);
        let divPagination = divScrollable.next("div.row");
        if (divPagination.length == 0) {
            divPagination = $('<div class="row"></div>').insertAfter(divScrollable);
            divPagination.append('<div class="col-md-12 text-end mt-1"></div>');
        }
        let ulPagination = $('<ul class="pagination float-end"></ul>');
        if(setting.simple){
            let res = resPaginate, disablePrv = '', disableNex = '';
            if (res.prev_page_url == null) {
                disablePrv = "disabled";
                href = "#";
            }
            let liPrev = $(
                '<li class="page-item '+disablePrv+'"><a class="page-link" href="'+res.prev_page_url+'">&laquo; Previous</a></li>'
            );
            ulPagination.append(liPrev);
            eventClickPage(liPrev.find('a'), divScrollable, TABLE);
            if (res.next_page_url == null) {
                disableNex = "disabled";
                href = "#";
            }
            let liNext = $(
                '<li class="page-item '+disableNex+'"><a class="page-link" href="'+res.next_page_url+'">Next &raquo;</a></li>'
            );
            ulPagination.append(liNext);
            eventClickPage(liNext.find('a'), divScrollable, TABLE);
        } else {
            resPaginate.links.forEach((link) => {
                let disable = "",
                    active = "",
                    href = link.url;
                if (link.active) {
                    active = "active";
                    href = "#";
                }
                if (link.url == null) {
                    disable = "disabled";
                    href = "#";
                }
                let li = $(
                    '<li class="page-item '+disable+' '+active+'"><a class="page-link" href="'+href+'">'+link.label+'</a></li>'
                );
                eventClickPage(li.find('a'), divScrollable, TABLE);
                ulPagination.append(li);
            });
        }
        divPagination.find(".text-end").html(ulPagination);
    }

    function eventClickPage(a, divScrollable, TABLE) {
        let setting = $(TABLE).data(keyPrefix);
        $(a).click(function (evt) {
            evt.preventDefault();
            if (!$(this).parent().hasClass("active") &&
                    !$(this).parent().hasClass("disabled") || setting.reload) {
                let data = setting.data , url = this.href;
                if(setting.searching){
                    data.tsearch = $("#tPaginate-search").val();
                }
                if(setting.reload){
                    url = setting.url;
                    if(setting.state){
                        data.page = $(this).text();
                    }
                    setting.reload = false;
                }
                $.ajax({
                    url : url,
                    data : data,
                    headers : {
                        'tpaginate' : 'paginate-event'
                    },
                    dataType : 'JSON',
                    success : function (res) {
                        generateTr(res, TABLE);
                        genPages(divScrollable, res, TABLE);
                    },
                }).always(function (params) {
                    if (typeof setting.onPageClick == "function") {
                        setting.onPageClick(params);
                    }
                });
            }
        });
    }
})(jQuery);
