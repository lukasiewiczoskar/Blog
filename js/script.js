'use strict'
{
	const titleClickHandler = function (event) {
		event.preventDefault()
		const clickedElement = this

		/*[DONE] remove class 'active' from all article links  */
		const activeLinks = document.querySelectorAll('.titles a.active')

		for (let activeLink of activeLinks) {
			activeLink.classList.remove('active')
		}
		/*[DONE] add class 'active' to the clicked link */
		clickedElement.classList.add('active')
		/*[DONE] remove class 'active' from all articles */
		const activeArticles = document.querySelectorAll('.posts .active')

		for (let activeArticle of activeArticles) {
			activeArticle.classList.remove('active')
		}
		/* get 'href' attribute from the clicked link */
		const articleSelector = clickedElement.getAttribute('href')
		/* find the correct article using the selector (value of 'href' attribute) */
		const targetArticle = document.querySelector(articleSelector)
		/* add class 'active' to the correct article */
		targetArticle.classList.add('active')
	}

	const optArticleSelector = '.post',
		optTitleSelector = '.post-title',
		optTitleListSelector = '.titles',
		optArticleTagsSelector = '.post-tags .list',
		optArticleAuthorSelector = '.post-author',
		optTagsListSelector = '.tags.list',
		optCloudClassCount = 5,
		optCloudClassPrefix = 'tag-size-'

	const generateTitleLinks = function (customSelector = '') {
		/* remove contents of titleList */
		const titleList = document.querySelector(optTitleListSelector)
		titleList.innerHTML = ''

		/* for each article */
		const articles = document.querySelectorAll(optArticleSelector + customSelector)

		let html = ''

		for (let article of articles) {
			/* get the article id */
			const articleId = article.getAttribute('id')
			/* find the title element */
			const articleTitle = article.querySelector(optTitleSelector).innerHTML
			/* create HTML of the link */
			const linkHtml = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'
			/* insert link into titleList */
			html = html + linkHtml
		}

		titleList.innerHTML = html

		const links = document.querySelectorAll('.titles a')

		for (let link of links) {
			link.addEventListener('click', titleClickHandler)
		}
	}
	generateTitleLinks()

	const calculateTagsParams = function (tags) {
		const params = { max: 0, min: 999999 }
		for (let tag in tags) {
			if (tags[tag] > params.max) {
				params.max = tags[tag]
			} else if (tags[tag] < params.min) {
				params.min = tags[tag]
			}
		}
		return params
	}
	const calculateTagClass = function (count, params) {
		const normalizedCount = count - params.min
		const normalizedMax = params.max - params.min
		const percentage = normalizedCount / normalizedMax
		const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1)
		return optCloudClassPrefix + classNumber
	}

	const generateTags = function () {
		/* [NEW] create a new variable allTags with an empty object */
		let allTags = {}
		/*[DONE] find all articles */
		const articles = document.querySelectorAll(optArticleSelector)
		/*[DONE] START LOOP: for every article: */
		for (let article of articles) {
			/*[DONE] find tags wrapper */
			const tagsWrapper = article.querySelector(optArticleTagsSelector)
			/*[DONE] make html variable with empty string */
			let html = ''
			/*[DONE] get tags from data-tags attribute */
			const articleTags = article.getAttribute('data-tags')
			/*[DONE] split tags into array */
			const articleTagsArray = articleTags.split(' ')
			/*[DONE] START LOOP: for each tag */
			for (let tag of articleTagsArray) {
				/*[DONE] generate HTML of the link */
				const linkHtml = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>'
				/*[DONE] add generated code to html variable */
				html = html + linkHtml
				/* [NEW] check if this link is NOT already in allTags */
				if (!allTags[tag]) {
					/* [NEW] add generated code to allTags array */
					allTags[tag] = 1
				} else {
					allTags[tag]++
				}

				/*[DONE] END LOOP: for each tag */
			}
			/*[DONE] insert HTML of all the links into the tags wrapper */
			tagsWrapper.innerHTML = html
			/*[DONE] END LOOP: for every article: */
		}
		/* [NEW] find list of tags in right column */
		const tagList = document.querySelector(optTagsListSelector)

		/* [NEW] create variable for all links HTML code */
		const tagsParams = calculateTagsParams(allTags)
		let allTagsHTML = ''

		/* [NEW] START LOOP: for each tag in allTags: */
		for (let tag in allTags) {
			/* [NEW] generate code of a link and add it to allTagsHTML */
			allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ') ' + '</a></li>'
			const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams) + '</li>'
			console.log('tagLinkHTML:', tagLinkHTML)
			/* [NEW] END LOOP: for each tag in allTags: */
		}
		/*[NEW] add HTML from allTagsHTML to tagList */
		tagList.innerHTML = allTagsHTML
	}

	generateTags()

	function tagClickHandler(event) {
		/*[DONE] prevent default action for this event */
		event.preventDefault()
		/*[DONE] make new constant named "clickedElement" and give it the value of "this" */
		const clickedElement = this
		/*[DONE] make a new constant "href" and read the attribute "href" of the clicked element */
		const href = clickedElement.getAttribute('href')
		/*[DONE] make a new constant "tag" and extract tag from the "href" constant */
		const tag = href.replace('#tag-', '')
		/*[DONE] find all tag links with class active */
		const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]')
		/*[DONE] START LOOP: for each active tag link */
		for (let tagLink of tagLinks) {
			/*[DONE] remove class active */
			tagLink.classList.remove('active')
			/*[DONE] END LOOP: for each active tag link */
		}
		/*[DONE] find all tag links with "href" attribute equal to the "href" constant */
		const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]')
		/*[DONE] START LOOP: for each found tag link */
		for (let hrefTagLink of hrefTagLinks) {
			/*{DONE} add class active */
			hrefTagLink.classList.add('active')
			/*{DONE} END LOOP: for each found tag link */
		}
		/*{DONE} execute function "generateTitleLinks" with article selector as argument */
		generateTitleLinks('[data-tags~="' + tag + '"]')
	}

	const addClickListenersToTags = function () {
		/* find all links to tags */
		const tagLinks = document.querySelectorAll('a[href^="#tag-"]')
		/* START LOOP: for each link */
		for (let tagLink of tagLinks) {
			/* add tagClickHandler as event listener for that link */
			tagLink.addEventListener('click', tagClickHandler)
			/* END LOOP: for each link */
		}
	}

	addClickListenersToTags()

	const generateAuthors = function () {
		const articles = document.querySelectorAll(optArticleSelector)

		for (let article of articles) {
			const findAuthors = article.querySelector(optArticleAuthorSelector)

			let html = ''

			const dataAuthor = article.getAttribute('data-author')

			const linkHtml = '<li><a href="#author-' + dataAuthor + '"><span>' + dataAuthor + '</span></a></li>'

			html = html + linkHtml

			findAuthors.innerHTML = html
		}
	}

	generateAuthors()

	const authorClickHandler = function (event) {
		event.preventDefault()

		const clickedElement = this

		const href = clickedElement.getAttribute('href')

		const author = href.replace('#author-', ' ')

		const activeAuthorsLinks = document.querySelectorAll('a.active[href^="#author-"]')

		for (activeAuthorsLink of activeAuthorsLinks) {
			activeAuthorsLink.classList.remove('active')
		}
		const authorLinks = document.querySelectorAll('a.active[href^="#author-]' + href + '"')

		for (let authorlink of authorLinks) {
			authorlink.classList.add('active')
		}

		generateTitleLinks('[data-author="' + author + '"]')
	}

	const addClickListenersToAuthors = function () {
		const authorLinks = document.querySelectorAll('a[href^="#author-"]')

		for (let authorLink of authorLinks) {
			authorLink.addEventListener('click', authorClickHandler)
		}
	}
	addClickListenersToAuthors()
}
