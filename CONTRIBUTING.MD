# How to report a bug

### File a bug report.

When filing an issue, make sure to answer these questions:

1. What did you do?
2. What did you expect to see?
3. What did you see instead?

# How to suggest a feature or enhancement

### Suggesting a feature
If you find yourself wishing for a feature that doesn't exist on the Faultline Site, you are probably not alone. There are bound to be others out there with similar needs. Open an issue on our issues list on GitHub which describes the feature you would like to see, why you need it, and how it should work.

To report an issue, go to the Issues tab. Click "New Issue" and fill out the form.

The title should appear in the following format:
>LABEL/short description

* LABEL - Make sure to also mark the issue with this label
    * feat - feature or functionality being added
    * bug - a fix
    * style - usually code style fixes, no functionality change
    * refactor - code that is being reorganized, no functionality change
    * doc - adding comments or documentation 
    * perf - performance related issues, lower priority than a bug

# Code, commit message and labeling conventions

### Preferred style for code

* Tabs!
* Class names use hyphens.
* Use minimal specificity in your CSS.

### Branch name conventions

>TYPE/ISSUE#/SHORTDESC

* TYPE
    * feat - feature or functionality being added
    * bug - a fix
    * style - usually code style fixes, no functionality change
    * refactor - code that is being reorganized, no functionality change
    * doc - adding comments or documentation 
    * perf - performance related issues, lower priority than a bug

* ISSUE#
    * The issue number that this branch is being cut for
    
* SHORTDESC
    * A short hyphen-deliminated-name usually based on the issue title

### Commit message conventions

>TYPE: ~50 char description

Commit message types may not always match the branch type and this is ok. Each commit should be a wrapper for related changes. Small commits make it easier for other developers to understand the changes and roll them back if something went wrong.

Committing often keeps your commits small and, again, helps you commit only related changes. You should only commit code when it‘s completed. 

* TYPE
    * feat - feature or functionality being added
    * bug - a fix
    * style - usually code style fixes, no functionality change
    * refactor - code that is being reorganized, no functionality change
    * doc - adding comments or documentation 
    * perf - performance related issues, lower priority than a bug
    
[source: [Github](https://github.com/trein/dev-best-practices/wiki/Git-Commit-Best-Practices)]  

# Ground Rules

### Responsibilities
* Ensure that your code changes don't break any the existing site.
* Ensure that code that goes into core meets all requirements in the checklist below.
* Create issues for any major changes and enhancements that you wish to make or see made. Discuss things transparently and get team feedback.

### Code Checklist

- [ ] Is this change useful to me, or something that I think will benefit others greatly?
- [ ] Check for overlap with other pull requests.
- [ ] Does it have tests? Explain how to test the code in your Pull Request.
- [ ] Decide whether the changes in master make sense as a major, minor, or patch release.
- [ ] Look at the clock. If you're tired, push later when you have time to deal with potential issues.

### Code review process

Pull Requests will be reviewed and tested by an admin. Comments will need to be addressed prior to merging in the branch. It is also expected that the master branch will be merged into your local branch before pushing your code in order to avoid merge issues.
