# jQuery tPagination Plugin Documentation
### Just Small jQuery Plugin for supporting paginate function in laravel :D.
## Overview
This plugin is designed to provide pagination functionality integrated with Laravel's paginate function using AJAX. It supports features like searching, entry count selection, and customizable columns, making it suitable for data table pagination in a Laravel-based web application.

### Versi
- **1.3.0**


## Fitur
- Server-side pagination with Laravel
- AJAX-based data retrieval
- Search functionality
- Dynamic entry page counts
- Pagination controls (simple or advanced)
- Optional buttons for update and delete actions
- Customizable columns

## Usage

### Basic Setup
Include the plugin in your HTML and initialize it on a table element:

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/tPaginate.js"></script>

<table id="example-table">
  <!-- Konten tabel -->
</table>

<script>
  $('#example-table').tPaginate({
    url: '/api/paginate',  // Endpoint untuk data paginasi
    colId: 'id',           // Kolom primary key
    cols: ['name', 'email', 'age'],  // Kolom yang ditampilkan
    entryPage: true,        // Aktifkan selektor jumlah entri per halaman
    searching: true,        // Aktifkan bidang pencarian
  });
</script>
```

### Options

The plugin accepts various options to customize its behavior. Here are the available options:
| Option | Type | Default | Description 
| ------ | ---- | ------- | -- 
| `Option` |	Type |	Default |	Description 
| `numbering` |	boolean |	true |	Enables row numbering. 
| `useButtons` |	boolean |	true |	Enables update and delete buttons. 
| `searching` |	boolean |	true |	Enables the search field. 
| `entryPage` |	boolean |	false |	Enables entry count selector. 
| `cols` |	array |	[] |	Array of column names or custom render functions. 
| `colId` |	string |	"" |	Column name for primary key (required if useButtons  is true).
| `url` |	string |	window.location.href |	URL for fetching data (required). 
| `data` |	object |	{} |	Additional data to send with the AJAX request. 
| `state` |	boolean |	true |	Retain state of pagination. 
| `simple` |	boolean |	false |	Enables simple pagination (previous/next only). 
| `reload` |	boolean |	false |	Reload table on pagination click. 
|`classBtnUpdate` |	string |	"btn btn-xs btn-info btn-update" |	CSS classes for the update button
| `classBtnDelete` |	string |	"btn btn-xs btn-danger btn-delete" |	CSS classes for the delete button.
| `searchPlaceholder` |	string |	"Search..."	| Placeholder text for the search  field.
| `entryPageNumber` |	array |	[15, 30, 75, 100] |	Entry page size options. 
| `onReady` |	function |	null |	Callback triggered when table is ready. 
| `onError` |	function |	null |	Callback triggered when there is an error. 
| `onAlways` |	function |	null |	Callback triggered after each AJAX request. 
| `onPageClick` |	function |	null |	Callback triggered on page click event. 

### Example: Customizing Columns

You can customize how columns are displayed by passing an array of column names or functions. For example:
```html
$('#example-table').tPaginate({
  cols: [
    'name',
    function (obj) {
      return '<strong>' + obj.email + '</strong>';
    },
    {
      key: 'age',
      class: 'text-center'
    }
  ]
});
```
### Methods

The plugin exposes the following methods:
| Method |	Description
| -- | -- 
| `init(options)` |	Initializes the plugin with the provided options.
| `reload()`	| Reloads the current page with updated data.

### Example: Reload the Table

You can programmatically reload the table using the reload method:
```html
$('#example-table').tPaginate('reload');
```

### Callbacks

The plugin supports various callbacks to handle different events:

- `onReady(TABLE)`: Triggered when the table is rendered and ready.
- `onError(res, status, message)`: Triggered if there's an error during data retrieval.
- `onAlways(res)`: Triggered after every AJAX request, regardless of success or failure.
- `onPageClick(params)`: Triggered when a page is clicked in the pagination controls.

### Example: Handling the Ready Event

You can perform custom actions when the table is ready by defining the onReady callback:
```html
$('#example-table').tPaginate({
  onReady: function(TABLE) {
    console.log('Table is ready', TABLE);
  }
});
```

### Events

The following events are supported by the plugin:
| Event |	Description
| -- | --
| `paginate-event` |	Triggered when a pagination link is clicked.
| `searching`  |	Triggered when a search is performed.
| `initial-table` |	Triggered on the initial table load.
| `entry-count` |	Triggered when the entry page size is changed.

## Pagination Modes

There are two modes of pagination:

### Simple Pagination

Simple pagination only provides "Previous" and "Next" buttons. To enable it, set the `simple` option to `true`.
```html
$('#example-table').tPaginate({
  simple: true
});
```

### Advanced Pagination

Advanced pagination shows numbered pages along with "Previous" and "Next" buttons.

```html
$('#example-table').tPaginate({
  simple: false
});
```
