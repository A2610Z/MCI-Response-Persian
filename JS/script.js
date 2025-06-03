$(document).ready(function () {
    let responseList = [];
    let table;

    // Load JSON and initialize DataTable
    $.getJSON("./MCI-behsa-response.json", function (data) {
        responseList = data.data;

        table = new DataTable("#response", {
            data: responseList,
            processing: true,
            scrollX: true,
            stateSave: true,
            columns: [
                { data: "Id" },                   // 0
                { data: "Title" },                // 1
                { data: "DetailTitle" },          // 2
                { data: "ChargeType" },           // 3
                { data: "ChargeAmount" },         // 4
                { data: "GiftAmount" },           // 5
                { data: "Amount" },               // 6
                { data: "ProductId" },            // 7
                { data: "ProductTitle" },         // 8
                { data: "Volume" },               // 9 (hidden)
                { data: "System" },               // 10 (hidden)
                { data: "Duration" },             // 11
                { data: "AmountWithTax" },        // 12 (hidden)
                { data: "ProductCategoryId" },    // 13 (hidden)
                { data: "ProductCategoryName" },  // 14 (hidden)
                { data: "SubCategoryId" },        // 15 (hidden)
                { data: "SubCategoryName" },      // 16 (hidden)
                { data: "DurationUnit" },         // 17 (hidden)
                { data: "DurationName" },         // 18 (hidden)
                { data: "OfferCode" },            // 19 (hidden)
                { data: "DIYProperty" },          // 20 (hidden)
                { data: "CategoryId" },           // 21 (hidden)
                { data: "ServiceTypeDesc" },      // 22 (hidden)
                { data: "ServiceType" },          // 23 (hidden)
                { data: "brokerId" },             // 24 (hidden)
                { data: "customerId" },           // 25 (hidden)
                { data: "vendorId" },             // 26 (hidden)
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    defaultContent: `
                        <div class="inline-buttons">
                            <button type="button" class="btn btn-secondary btn-sm delete-button" title="Delete" aria-label="Delete row">
                                <i class="bi bi-trash" aria-hidden="true"></i>
                            </button>
                        </div>`
                }
            ],
            language: {
                emptyTable: "هیچ داده‌ای در جدول وجود ندارد",
                info: "نمایش _START_ تا _END_ از _TOTAL_ رکورد",
                infoEmpty: "نمایش 0 تا 0 از 0 رکورد",
                infoFiltered: "(فیلتر شده از _MAX_ رکورد)",
                lengthMenu: "نمایش _MENU_ رکورد",
                loadingRecords: "در حال بارگذاری...",
                processing: "در حال پردازش...",
                search: "جستجو:",
                zeroRecords: "رکوردی مطابق با جستجوی شما پیدا نشد",
                paginate: {
                    first: "اولین",
                    last: "آخرین",
                    next: "بعدی",
                    previous: "قبلی"
                },
                aria: {
                    sortAscending: ": مرتب‌سازی صعودی",
                    sortDescending: ": مرتب‌سازی نزولی"
                }
            },
            columnDefs: [
                {
                    targets: [
                        9, 10, 12, 13, 14, 15, 16, 17, 18,
                        19, 20, 21, 22, 23, 24, 25, 26
                    ],
                    visible: false
                }
            ]
        });
    });

    // Download JSON
    $("#download-json-button").click(function () {
        if (!responseList.length) {
            return alert("No data to download!");
        }

        const jsonStr = JSON.stringify({ data: responseList }, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

        link.href = URL.createObjectURL(blob);
        link.download = `data-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Upload JSON
    $("#upload-json-button").click(function () {
        $("#upload-json-file").click();
    });

    $("#upload-json-file").change(function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const json = JSON.parse(e.target.result);
                if (!Array.isArray(json.data)) {
                    return alert("Invalid JSON: 'data' must be an array.");
                }

                responseList = json.data;
                table.clear().rows.add(responseList).draw();
                alert("JSON uploaded successfully and table updated.");
            } catch (err) {
                alert("Failed to parse JSON: " + err.message);
            }
        };
        reader.readAsText(file);
        $(this).val("");
    });

    // Delete row
    $("#response tbody").on("click", ".delete-button", function () {
        const row = $(this).closest("tr");
        const rowData = table.row(row).data();

        if (confirm("Delete this record?")) {
            table.row(row).remove().draw();
            responseList = responseList.filter(item => item.Id !== rowData.Id);
        }
    });
});
