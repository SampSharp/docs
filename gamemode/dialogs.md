---
title: Dialogs
---

Introduction
------------
SampSharp supports all of the dialog styles from SA:MP, implemented in an object-oriented manner. 

The available dialog classes are:

| SampSharp class | SA:MP Equivalent                                        |
| --------------- | ------------------------------------------------------- |
| `InputDialog`   | `DIALOG_STYLE_INPUT` or `DIALOG_STYLE_PASSWORD`         |
| `MessageDialog` | `DIALOG_STYLE_MSGBOX`                                   |
| `ListDialog`    | `DIALOG_STYLE_LIST`                                     |
| `TabListDialog` | `DIALOG_STYLE_TABLIST` or `DIALOG_STYLE_TABLIST_HEADERS`|

Displaying a dialog
----------------
Displaying a dialog for a player is very easy. All you have to do is create a dialog using your chosen class and use the `.Show(BasePlayer player)` method on all dialogs.

Example
``` c#
var loginDialog = new InputDialog("Log In", "Please log in!", true, "Button1", "Button2");
loginDialog.Show(player);
```

If you want to display a **(tab)list** dialog, you will have to add the items to the list. This can be done using the `.Add(string item)` method, like any other collection.
For example:
``` c#
var var vehicleList = new ListDialog("vehicle list", "Details", "Cancel");
vehicleList.Add("Infernus");
vehicleList.Show(player);
```

Working with responses
---------------
Obviously, you'll need to know how the user responded to your dialog. 

Handling responses is very easy, as the dialog class raises a `Response` event for every instance. So, all you have to do is handle this event:

``` c#
loginDialog.Response += LoginDialog_Response;
// etc etc
public void LoginDialog_Response(object sender, DialogResponseEventArgs eventArgs)
{
  // handle the response
}
```
or, using a [lambda](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/lambda-expressions):

``` c#
loginDialog.Response += (sender, eventArgs) => {
  // handle the response
};
```
The most common thing to do next is check whether the player clicked the left or the right button (or pressed esc), and then use the input text or the list item select or confirm an action etc.

All of this can be done using the `eventArgs` (**Event Arguments**).
So, the login dialog would look like this:
``` c#
public void LoginDialog_Response(object sender, DialogResponseEventArgs eventArgs)
{
  if (e.DialogButton == DialogButton.Right)
  {
    // Player pressed exit or esc. They don't want to log in :(
  }
  else
  {
    // they pressed okay, go for it
  }
}
```

| Response argument | Meaning |
| ----------------- | ------- |
| `e.DialogButton` | The button that the player pressed. Has the value `DialogButton.Right` if they canceled (*ESC*). |
| `e.InputText` | The text they input in the dialog. Obviously, works only for `InputDialog`.  |
| `e.ListItem` | The item they selected (starting from 0) in the dialog. Obviously, works only for `ListDialog` and `TabListDialog`.  |
| `e.Player` | The `BasePlayer` that responded to the dialog. |
| `e.DialogId` | The id of the dialog. |

Tab list dialogs
-----------------
As you have seen, you can create tab lists dialog by creating a new `TabListDialog` object.
However, this class works for both `DIALOG_STYLE_TABLIST_HEADERS` and `DIALOG_STYLE_TABLIST`. Thus, you have to explicitly specify the number of columns for a simple tab list, or the name of each column for a list with headers.
The difference can be observed in the following examples:
``` c#
// This will create a simple tab list.
var var vehicleList = new TablistDialog("vehicle list", 2, "Details", "Cancel");
vehicleList.Add(new [] 
{ 
  "Infernus", 
  "$5000"
});
vehicleList.Show(player);
```
versus
``` c#
// This will create a tab list with headers.
var vehicleList = new TablistDialog("vehicle list", new [] { 
  "Name", 
  "Price" 
}, "Details", "Cancel");
vehicleList.Add(new [] 
{ 
  "Infernus", 
  "$5000"
});
vehicleList.Show(player);
```

>**Note!**
>The number of columns **must** be equal to the size of the array/list provided to the `Add` method, or an exception will be raised.
