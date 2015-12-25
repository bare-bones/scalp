# scalp
a simpler way to scaffold 

***Installation***

```
 npm install -g scalp
```

***Usage***

```
 scalp new <path> [-s url] 
```
creates a new skeleton with prompts for variables in `<path>` (defaults to current directory) will optionally accept a github url to use as a skeleton

If this looks very similar to Brunch to you, that's because it is.  Scalp takes just the 1st part of Brunch (the skeletons) and adds the ability easily add variables to your skeletons.


```
 scalp init <path>
```
adds a scalp.config.js file to the current directory, pre-populated with any found variables.

scalp uses [prompt](https://www.npmjs.com/package/prompt) for validation and other options.


Scalp look for any string in any file that starts with 'scalp_' and treat that as a variable. 
By default, the user will be prompted with a humanized version of the variable, but you can configure how the user supplies
those values.  