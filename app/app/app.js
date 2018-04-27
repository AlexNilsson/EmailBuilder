const defaultFontFamily = [
  'inherit',
  'Georgia, serif',
  '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif',
  '\'Times New Roman\', Times, serif',
  'Arial, Helvetica, sans-serif',
  '\'Arial Black\', Gadget, sans-serif',
  '\'Comic Sans MS\', cursive, sans-serif',
  'Impact, Charcoal, sans-serif',
  '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif',
  'Tahoma, Geneva, sans-serif',
  '\'Trebuchet MS\', Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
  '\'Courier New\', Courier, monospace',
  '\'Lucida Console\', Monaco, monospace'
]

Vue.config.devtools = true

const confs = {
  storage: {
    /**
     * Get Email from localStorage
     */
    get: function () {
      return new Promise(function (resolve, reject) {
        try {
          let email = {
          // name: 'New Email',
            elements: [],
            html: '',
            emailSettings: {
              options: {
                width: 600,
                paddingTop: 50,
                paddingBottom: 50,
                backgroundColor: '#f4f5f4'
              },
              type: 'emailSettings'
            }
          }
          // Emulate response from server
          setTimeout(function () {
            resolve(email)
          }, 300)
        } catch (e) {
          utils.notify(e).error()
          reject(e)
        }
      })
    },

    /**
     * Put changed data in Email
     * Emulate server storage with Promise
     * @param email
     * @returns {Promise}
     */
    put: function (email) {
      return new Promise(function (resolve, reject) {
        try {
        // Remove multine breaks
          email.html = utils.removeLineBreaks(email.html)
          localStorage.setItem('jqueryEmail', JSON.stringify(email))
          resolve()
        } catch (e) {
          utils.notify(e).error()
          reject(e)
        }
      })
    }
  },
  options: {
    urlToUploadImage: '//uploads.im/api',
    trackEvents: false, // You need to add google analytics in index.html
    mjmlPublicKey: '961d11e0-9ddc-47ed-95c6-825951e60d14',
    mjmlApplicationId: '17ba7701-c1aa-48ba-8407-443505ae5d43',
    assetsPath: 'http://localhost:9000/assets'
  }
}
let utils = {
    /**
     * Convert string from snake to camel
     * @param str
     * @returns {*}
     */
  snakeToCamel: function (str) {
    if (typeof str !== 'string') return str
    return str.replace(/_([a-z])/gi, function (m, w) {
      return '' + w.toUpperCase()
    })
  },
    /**
     * Convert camel to snake
     * @param str
     * @returns {*}
     */
  camelToSnake: function (str) {
    if (typeof str !== 'string') return str
    return str.replace(/([A-Z])/g, function (m, w) {
      return '_' + w.toLowerCase()
    })
  },
    /**
     * Generate random id
     * @param prefix
     * @returns {string}
     */
  uid: function (prefix) {
    return (prefix || 'id') + (new Date().getTime()) + 'RAND' + (Math.ceil(Math.random() * 100000))
  },
  compileMJML: function (email) {
    email = email || {}

    function getCompileElement(element){

      var tableHTML = ''

      switch (element.type) {
        case 'button':

          var fontStyle = element.options.font.italic ? 'italic' : 'normal'
          
          var width = element.options.fullWidth === 'true' ? '100%' : 'auto'

          var link = element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null

          tableHTML = ""
          
          tableHTML += '<tr>'
            tableHTML += '<td style="background-color: ' + element.options.backgroundColor + '; padding:' + utils.paddingArrayToString(element.options.padding) + '; text-align: ' + element.options.align + ';">'
              tableHTML += '<a href="' + link + '" style="background-color: ' + element.options.buttonBackgroundColor + '; color: ' + element.options.font.color + '; font-family: ' + `${element.options.font.family}` + '; font-size: ' + `${element.options.font.size}px` + '; line-height: 19px; display: inline-block; border-radius: ' + `${element.options.border.radius}px` + '; border: ' + `${element.options.border.size}px ${element.options.border.style} ${element.options.border.color}` + '; text-decoration: none; font-style: ' + fontStyle + '; font-weight: ' + element.options.font.weight + '; margin: 0px; width: ' + width + '; padding: ' + utils.paddingArrayToString(element.options.innerPadding) + ';">'
                tableHTML += element.options.buttonText
              tableHTML += '</a>'
            tableHTML += '</td>'
          tableHTML += '</tr>'

          return {
              tagName: 'mj-table',
              attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
              content: tableHTML
            }
        case 'text':

          let lineHeight = (element => {
            let lineHeight = 0
            let fontSize = element.options.font.size

            switch (element.options.lineHeight) {
              case 's1': lineHeight = fontSize; break
              default: case 's2': lineHeight = fontSize * 1.25; break
              case 's3': lineHeight = fontSize * 1.5; break
              case 's4': lineHeight = fontSize * 2; break
            }

            return lineHeight + 'px'
          })(element)

          tableHTML = ''
          tableHTML += '<tr>'
            tableHTML += '<td style="background-color:' + element.options.backgroundColor + '; padding:' + utils.paddingArrayToString(element.options.padding) + ';">'
              tableHTML += '<div style="cursor: auto; color: rgb(0, 0, 0); font-family: ' + element.options.font.family + '; font-size: ' + element.options.font.size + 'px; line-height: ' + lineHeight + '; text-align: left;">'
                tableHTML += element.options.text
              tableHTML += '</div>'
            tableHTML += '</td>'
          tableHTML += '</tr>'

          return {
            tagName: 'mj-table',
            attributes: {'padding': 'none'},
            content: tableHTML
          }

        case 'divider':

          tableHTML = ''

          tableHTML += '<tr>'
            tableHTML += '<td style="font-size: 0px; word-wrap: break-word; background-color: ' + element.options.backgroundColor + '; padding: ' + utils.paddingArrayToString(element.options.padding) + ';">'
              tableHTML += '<p style=" font-size: 1px; margin: 0px auto; border-top: ' + `${element.options.border.size}px` + ' ' + `${element.options.border.style}` + ' ' + `${element.options.border.color}` + '; width: 100%;"></p>'
            tableHTML += '</td>'
          tableHTML += '</tr>'

          return {
            tagName: 'mj-table',
            attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
            content: tableHTML
          }

        case 'image':

          tableHTML = ''

          tableHTML += '<tr>'
            tableHTML += '<td align="' + element.options.align + '" style="background-color: ' + element.options.backgroundColor + '; padding: ' + utils.paddingArrayToString(element.options.padding) + ';">'
              tableHTML += '<a href="' + element.options.url + '">'
                tableHTML += '<img src="' + element.options.image + '" alt="' + element.options.altTag + '" style="display: block; max-width: 100%; width: ' + element.options.width + 'px;">'
              tableHTML += '</a>'
            tableHTML += '</td>'
          tableHTML += '</tr>'

          return {
              tagName: 'mj-table',
              attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
              content: tableHTML
            }
        case 'social':
          let links = ''
          Object.keys(element.options.links).forEach(key => {
            if (element.options.links[key].active) {
              links += `<a href="${element.options.links[key].link}" target="_blank" style="border: none;text-decoration: none;">
                                                <img border="0" width="${element.options.iconSize}" src="${confs.options.assetsPath}/social/${key}.png">
                                            </a>`
            }
          })
          
          tableHTML = ''

          tableHTML += '<tr>'
            tableHTML += '<td align="' + element.options.align + '" style="line-height: 0; color:' + element.options.color + '; background-color: ' + element.options.backgroundColor + '; padding: ' + utils.paddingArrayToString(element.options.padding) + ';">'
              tableHTML += links
            tableHTML += '</td>'
          tableHTML += '</tr>'

          return {
            tagName: 'mj-table',
            attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
            content: tableHTML
          }
        case 'video':

          let videoWidth = element.options.fullWidth === 'true' ? '100%' : element.options.width
          let float = element.options.align === 'center' ? 'none' : element.options.align
          
          let iframeContent = '<iframe style="float: ' + float + '; width: ' + videoWidth + 'px !important;" width=' + videoWidth + ' height=' + element.options.height + ' src=' + element.options.url + " frameborder='0' allowfullscreen></iframe>"
          
          tableHTML = ''

          tableHTML += '<tr>'
            tableHTML += '<td style="line-height: 0; font-size: 0; background-color: ' + element.options.backgroundColor + '; padding: ' + utils.paddingArrayToString(element.options.padding) + '; ">'
              tableHTML += iframeContent
            tableHTML += '</td>'
          tableHTML += '</tr>'
          
          return {
            tagName: 'mj-table',
            attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
            content: tableHTML
          }
        case 'html':
          return {
                tagName: 'mj-text',
                attributes: {
                  'font-size': '13px',
                  'color': 'rgb(0, 0, 0)',
                  'line-height': '20px',
                  'padding': 0
                },
                content: element.options.html
              }

        case 'products':

          tableHTML = ''
          
          for (let row = 0; row < element.options.rows; row++) {

            tableHTML += '<tr>'

            for (let column = 0; column < element.options.columns; column++) {

              tableHTML += '<td style="padding: ' + utils.paddingArrayToString(element.options.padding) + '; background-color: ' + element.options.backgroundColor + ';">'
                tableHTML += '<div style="box-sizing: border-box; padding: 2px; text-align: center; width: 100%;">'
                
                  let product = element.options.products[row * element.options.columns + column]
                  
                  tableHTML += '<div style="box-sizing: border-box;">'
                  tableHTML += '<img style="max-width: 100%;" src="' + product.image + '" alt="' + product.name + '" align="center">'
                  tableHTML += '</div>'
                  
                  tableHTML += '<div style="margin-bottom: 20px;">'
                  
                  if (element.options.showProductName) tableHTML += '<h1 style="font-size: 20px; font-weight: bold; padding: 4px; margin: 0; margin-top: 8px;">' + product.name + '</h1>'
                  if (element.options.showProductPrice) tableHTML += '<h2 style="padding: 8px; margin-bottom: 8px; font-size: 16px; margin-top: 0px;">' + product.price + '</h2>'
                  if (element.options.showProductButton) tableHTML += '<a href="' + product.buyURL + '" style="display: inline-block; text-decoration: none; padding: 12px 20px; background-color:' + product.buttonColor + '; border: 0; border-radius: 2px; font-weight: bold; color: #fff;">' + product.buttonText + '</a>'
                  
                  tableHTML += '</div>'
                
                tableHTML += '</div>'
              tableHTML += '</td>'
            }

            tableHTML += '</tr>'
          }

          return {
            tagName: 'mj-table',
            attributes: {'padding': utils.paddingArrayToString(element.options.margin)},
            content: tableHTML
          }

          
        default:
        console.error('unknown element:', element.type)
          return false
      }


    }


    //* Compile Email Contents

    let emailElements = []

    email.elements.forEach( element => {

      let childElementMargin = element.options.margin !== undefined ? utils.paddingArrayToString(element.options.margin) : "none"
      
      let compiledElement = {
        tagName: 'mj-section',
        attributes: {
          'full-width': 'full-width',
          'background-color': 'transparent',
          'padding': 'none'
        },
        children: []
      }

      if ( element.type === 'section' ) {
        // Section Element

          element.options.columns.forEach( column => {

            compiledElement.children.push({
              tagName: 'mj-column',
              attributes: {
                'background-color': 'transparent'
              },
              children: column.elements.map(
                childElement => getCompileElement(childElement)
              )
            })
          })


      } else {
        // Regular Element (top level)

        compiledElement.children.push({
          tagName: 'mj-column',
          attributes: {
            'width': '100%',
            'background-color': 'transparent'
          },
          children: [getCompileElement(element)]
        })
      }

      emailElements.push( compiledElement)

    })


    //* Compile Email Body
    let emailBody = {
      tagName: 'mjml',
      attributes: {},
      children: [{
        tagName: 'mj-head',
        attributes: {},
        children: [{
          tagName: 'mj-title',
          content: email.name
        },
        {
          tagName: 'mj-style',
          attributes: {},
          content: '@media all and (max-width: 480px) { td { width: 100%!important; } } iframe { width: 100%!important; }'
        }
        ]
      },
      {
        tagName: 'mj-body',
        attributes: {},
        children: [{
          tagName: 'mj-container',
          attributes: {
            'background-color': email.emailSettings.options.backgroundColor
          },
          children: [{
            tagName: 'mj-wrapper',
            attributes: {
              'padding-top': email.emailSettings.options.paddingTop + 'px',
              'padding-bottom': email.emailSettings.options.paddingBottom + 'px'
            },
            children: emailElements
          }]
        }]
      }
      ]
    }

    return emailBody
  },
  createEmail: function (email) {
    let compileMjmlObject = this.compileMJML(email)

    return new Promise(function (resolve, reject) {
      if (!confs.options.mjmlPublicKey || !confs.options.mjmlApplicationId) {
        console.log('api failure')
        return reject('You did\'nt include MJML API keys!')
      }

      let payload = JSON.stringify({
        mjml: JSON.stringify(compileMjmlObject)
      })

      return $.ajax({
        url: 'https://api.mjml.io/v1/render',
        method: 'POST',
        data: payload,
        datatype: 'json',
        processData: false,
        beforeSend (req) {
          req.setRequestHeader('Authorization', `Basic ${btoa(`${confs.options.mjmlApplicationId}:${confs.options.mjmlPublicKey}`)}`)
        },
        success (data) {
          return resolve(data)
        },
        error (a, b, c) {
          console.error(a, b, c)
        }
      })
    })
  },

    /**
     * Notify
     * @param msg
     * @param callback
     * @returns {{log: log, success: success, error: error}}
     */
  notify: function (msg, callback) {
    return {
      log: function () {
        return alertify.log(msg, callback)
      },
      success: function () {
        alertify.success(msg, callback)
      },
      error: function () {
        alertify.error(msg, callback)
      }
    }
  },

    /**
     * Confirm dialog
     * @param msg
     * @param succesFn
     * @param cancelFn
     * @param okBtn
     * @param cancelBtn
     * @returns {IAlertify}
     */
  confirm: function (msg, succesFn, cancelFn, okBtn, cancelBtn) {
    confirm(msg) ? (succesFn || Function)() : (cancelFn || Function)()

    /* return alertify
            .okBtn(okBtn)
            .cancelBtn(cancelBtn)
            .confirm(msg, succesFn, cancelFn) */
  },

    /**
     * Alert dialog
     * @param msg
     * @returns {IAlertify}
     */
  alert: function (msg) {
    return alertify
            .okBtn('Accept')
            .alert(msg)
  },

    /**
     * Prompt dialog
     * @param defaultvalue
     * @param promptMessage
     * @param successFn
     * @param cancelFn
     * @returns {IAlertify}
     */
  prompt: function (defaultvalue, promptMessage, successFn, cancelFn) {
    return alertify
            .defaultValue(defaultvalue)
            .prompt(promptMessage, successFn, cancelFn)
  },

    /**
     * Validate email before save and import
     * @param emailToValidate
     * @returns {boolean}
     */
  validateEmail: function (emailToValidate) {
    return Vue.util.isObject(emailToValidate) &&
            $.isArray(emailToValidate.elements) &&
            typeof emailToValidate.html === 'string' &&
            Vue.util.isObject(emailToValidate.emailSettings) &&
            emailToValidate.emailSettings.type === 'emailSettings' &&
            Vue.util.isObject(emailToValidate.emailSettings.options)
  },

    /**
     * Track events with Google Analytics
     * @param category
     * @param event
     * @param name
     * @returns {*}
     */
  trackEvent: function (category, event, name) {
    if (confs.trackEvents) {
      if (!ga) { throw new Error('To track events, include Google analytics code in index.html') }
      return ga('send', 'event', category, event, name)
    }
  },
  equals: function (obj1, obj2) {
    function _equals (obj1, obj2) {
      let clone = $.extend(true, {}, obj1),
        cloneStr = JSON.stringify(clone)
      return cloneStr === JSON.stringify($.extend(true, clone, obj2))
    }

    return _equals(obj1, obj2) && _equals(obj2, obj1)
  },
  removeLineBreaks: function (html) {
    return html.replace(/\n\s*\n/gi, '\n')
  },
  initTooltips: function () {
    setTimeout(function () {
      $('i[title]').powerTip({
        placement: 'sw-alt' // north-east tooltip position
      })
    }, 100)
  },
  paddingArrayToString: function (x) {
    return x.join('px ') + 'px'
  }
}
let emailBuilder = new Vue({
  data: function () {
    return {
      loading: true
    }
  },
  components: {
    'email-builder-component': function (resolve, reject) {
      Promise.all([$.get('builder/builder.html'), confs.storage.get()]).then(function (data) {
        resolve({
          data: function () {
            return {
              preview: false,
              currentElement: {},
              currentTab: 'elements',
              selectedNetwork: '',
              emailScreenMode: 'desktop',
              elements: [
                {
                  type: 'text',
                  icon: '&#xE8EE;',
                  primary_head: 'Text',
                  second_head: 'Editable text box'
                },
                {
                  type: 'image',
                  icon: '&#xE40B;',
                  primary_head: 'Image',
                  second_head: 'Image without text'
                },
                {
                  type: 'divider',
                  icon: '&#xE8E9;',
                  primary_head: 'Divider',
                  second_head: '1px separation line'
                },
                {
                  type: 'button',
                  icon: '&#xE913;',
                  primary_head: 'Button',
                  second_head: 'Clickable URL button"'
                },
                {
                  type: 'social',
                  icon: 'share',
                  primary_head: 'Social Sharing',
                  second_head: '4 social icons'
                },
                {
                  type: 'html',
                  icon: 'code',
                  primary_head: 'HTML Block',
                  second_head: 'Editable HTML block'
                },
                {
                  type: 'video',
                  icon: 'video_library',
                  primary_head: 'Video',
                  second_head: 'Embed video source'
                },
                {
                  type: 'products',
                  icon: 'view_module',
                  primary_head: 'Products',
                  second_head: 'Grid of Products'
                }
              ],
              sectionTypes: [
                {
                  type: 'section',
                  icon: 'II',
                  columns: 2,
                  primary_head: 'a 2 column section'
                },
                {
                  type: 'section',
                  icon: 'III',
                  columns: 3,
                  primary_head: 'a 3 column section'
                },
                {
                  type: 'section',
                  icon: 'IIII',
                  columns: 4,
                  primary_head: 'a 4 column section'
                }
              ],
              defaultOptions: {
                'divider': {
                  type: 'divider',
                  options: {
                    subSection1: 'Divider style',
                    border: {
                      size: 1,
                      style: 'solid',
                      styleOptions: ['solid', 'dashed', 'dotted'],
                      color: '#DADFE1'
                    },
                    backgroundColor: '#ffffff',
                    margin: [0, 0, 0, 0],
                    padding: [15, 15, 15, 15]
                  }
                },
                'text': {
                  type: 'text',
                  options: {
                    subSection1: 'Text style',
                    font: {
                      size: 16,
                      sizeOptions: [9, 10, 11, 12, 13, 14, 16, 18, 24, 30, 36, 48, 60, 62],
                      family: 'inherit',
                      familyOptions: defaultFontFamily
                    },
                    lineHeight: 's2',
                    // margin: [0, 0, 0, 0],
                    backgroundColor: '#ffffff',
                    padding: [15, 15, 15, 15],
                    text: 'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                  }
                },
                'html': {
                  type: 'html',
                  options: {
                    html: '<p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
                  }
                },
                'button': {
                  type: 'button',
                  options: {
                    subSection1: 'Button settings',
                    buttonText: 'Click me',
                    linkTo: {
                      type: 'none',
                      typeOptions: ['link', 'email', 'none'],
                      link: ''
                    },
                    subSection2: 'Border style',
                    border: {
                      size: 1,
                      radius: 3,
                      color: '#3498DB',
                      style: 'solid',
                      styleOptions: ['dotted', 'solid', 'dashed']
                    },
                    subSection3: 'Button style',
                    fullWidth: 'false',
                    align: 'center',
                    buttonBackgroundColor: '#3498DB',
                    backgroundColor: '#ffffff',
                    font: {
                      size: 16,
                      sizeOptions: [9, 10, 11, 12, 13, 14, 16, 18, 24, 30, 36, 48, 60, 62],
                      color: '#ffffff',
                      weight: 'normal',
                      italic: '',
                      weightOptions: ['bold', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
                      family: 'inherit',
                      familyOptions: defaultFontFamily
                    },
                    innerPadding: [12, 20, 12, 20],
                    margin: [0, 0, 0, 0],
                    // subSection3: 'Styling',
                    padding: [15, 15, 15, 15]
                  }
                },
                'image': {
                  type: 'image',
                  options: {
                    subSection1: 'Image settings',
                    image: 'assets/350x150.jpg',
                    altTag: '',
                    url: '',
                    subSection2: 'Image style',
                    width: 370,
                    align: 'center',
                    backgroundColor: '#ffffff',
                    margin: [0, 0, 0, 0],
                    padding: [15, 15, 15, 15]
                  }
                },
                'video': {
                  type: 'video',
                  options: {
                    subSection1: 'Video settings',
                    url: 'https://www.youtube.com/embed/cbk8mXPyCcc',
                    subSection2: 'Video style',
                    fullWidth: 'true',
                    width: 600,
                    height: 350,
                    // subSection1: 'Styling',
                    align: 'center',
                    backgroundColor: '#ffffff',
                    margin: [0, 0, 0, 0],
                    padding: [0, 0, 0, 0]
                  }
                },
                'products': {
                  type: 'products',
                  options: {
                    subSection1: 'Product settings',
                    rows: 1,
                    columns: 2,
                    populateFromSource: {
                      isActive: true,
                      source: 'optionA',
                      sourceOptions: ['optionA', 'optionB'],
                      autoRecommend: true
                    },
                    subSection2: 'Product style',
                    activeProduct: {},
                    products: [
                      {
                        id: 1,
                        name: 'Product-1',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 2,
                        name: 'Product-2',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 3,
                        name: 'Product-3',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 4,
                        name: 'Product-4',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 5,
                        name: 'Product-5',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 6,
                        name: 'Product-6',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 7,
                        name: 'Product-7',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 8,
                        name: 'Product-8',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 9,
                        name: 'Product-9',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 10,
                        name: 'Product-10',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 11,
                        name: 'Product-11',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      },
                      {
                        id: 12,
                        name: 'Product-12',
                        image: 'assets/154x160.jpg',
                        price: '$199',
                        buttonText: 'Buy now!',
                        buttonColor: '#00abee',
                        buyURL: '/addToCart1'
                      }
                    ],
                    showProductName: 'true',
                    showProductButton: 'true',
                    showProductPrice: 'true',
                    backgroundColor: '#ffffff',
                    margin: [0, 0, 0, 0],
                    padding: [0, 0, 0, 0]
                  }
                },
                'section': {
                  type: 'section',
                  options: {
                    margin: [15, 15, 15, 15],
                    padding: [15, 15, 15, 15],
                    backgroundColor: '#ffffff',
                    columns: [{elements: []}, {elements: []}]
                  }
                },
                'unsubscribe': {
                  type: 'unsubscribe',
                  options: {
                    padding: [10, 50, 10, 50],
                    backgroundColor: '#eeeeee',
                    font: {
                      weight: 'normal',
                      weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
                      family: 'Arial, Helvetica, sans-serif',
                      familyOptions: defaultFontFamily
                    },
                    text: '<p style="text-align: center; margin: 0px 0px 10px 0px; line-height: 1; font-size: 20px;" data-block-id="text-area"><span style="font-size: 8pt; color: #333333;">If you\'d like to unsubscribe and stop receiving these emails<span style="color: #0000ff;"> <a style="color: #0000ff;" href="#">click here</a></span>.</span></p>'
                  }
                },
                'social': {
                  type: 'social',
                  options: {
                    subSection1: 'Social setting',
                    links: {
                      facebook: {
                        link: 'https://www.facebook.com/envato',
                        active: true
                      },
                      twitter: {
                        link: 'https://twitter.com/envatomarket',
                        active: true
                      },
                      linkedin: {
                        link: '',
                        active: false
                      },
                      youtube: {
                        link: 'https://www.youtube.com/user/Envato',
                        active: true
                      }
                    },
                    subSection2: 'Social style',
                    iconSize: 48,
                    align: 'center',
                    backgroundColor: '#ffffff',
                    margin: [0, 0, 0, 0],
                    padding: [10, 15, 10, 15]
                  }
                }
              },
              Email: data[1],
              lastElementIds: [],
              clonedEmail: JSON.parse(JSON.stringify(data[1]))
            }
          },
          mounted: function () {
            this.$root._data.loading = false
            // utils.initTooltips()
            this.Email = $.extend(true, {}, {
              elements: this.Email.elements.map(element => this.clone(element)),
              emailSettings: this.clone(this.Email.emailSettings)
            }, this.Email)
          },
          watch: {
            Email: {
              handler: function () {
              // utils.initTooltips()
              },
              deep: true
            },
            preview: function (val, oldval) {
              tinymce.editors.forEach(function (editor) {
                return editor[val ? 'hide' : 'show']()
              })
            },
            currentElement: function () {

            }
          },
          computed: {
            loading: function () {
              return this.$root._data.loading
            }
          },
          methods: {
            hasChanges: function () {
              return !utils.equals(this.Email, this.clonedEmail)
            },
            setCurrentElement: function (id, element) {
              let self = this
              if (self.preview || self.currentElement === element) return
              self.currentElement = {}
              self.currentTab = (id == 'emailSettings') ? 'emailSettings' : 'elements'

              setTimeout(function () {
                self.currentElement = element
              }, 10)
            },
            editElement: function (id) {
              if (!id) { return this.currentElement = {} }

              let self = this
              let editElement = (id !== 'emailSettings') ? self.Email.elements.find(function (element) {
                return element.id === id
              }) : self.Email[id]

              self.setCurrentElement(id, editElement)
            },
            editSectionElement: function (id, sectionIndex, columnIndex) {
              if (!id) { return this.currentElement = {} }

              let self = this

              let editElement

              if (id !== 'emailSettings') {
                editElement = self.Email.elements[sectionIndex].options.columns[columnIndex].elements.find(element => element.id === id)
              } else {
                editElement = self.Email[id]
              }

              self.setCurrentElement(id, editElement)
            },
            editElementWithId: function (id) {
              if (!id) { return this.currentElement = {} }

              let self = this

              // 1. Assume regular item
              let element = self.Email.elements.find(element => element.id === id)

              // 2. If not found, look in sections
              if (element === undefined) {
                element = self.Email.elements.filter(
                  element => element.type === 'section').map(
                    section => section.options.columns.map(
                      column => column.elements
                    ).reduce((a, b) => a.concat(b))
                  ).reduce((a, b) => a.concat(b)).find(
                    element => element.id === id
                  )
              }

              if (element !== undefined && element.type !== 'section') {
                self.setCurrentElement(id, element)
              }

              return this.currentElement = {}
            },
            removeElement: function (remElement) {
              let self = this
              return utils.confirm('Are you sure?', function () {
                self.Email.elements = self.Email.elements.filter(function (element) {
                  return element !== remElement
                })
                if (utils.equals(self.currentElement, remElement)) {
                  self.currentElement = {}
                }
              }, null, 'Delete element', 'Don\'t delete')
            },
            removeSectionElement: function (remElement, sectionIndex, columnIndex) {
              let self = this

              return utils.confirm('Are you sure?', function () {
                self.Email.elements[sectionIndex].options.columns[columnIndex].elements = self.Email.elements[sectionIndex].options.columns[columnIndex].elements.filter(element => element !== remElement)
                if (utils.equals(self.currentElement, remElement)) {
                  self.currentElement = {}
                }
              }, null, 'Delete element', 'Don\'t delete')
            },
            saveEmailTemplate: function () {
              let self = this
              utils.createEmail(self.Email).then(function (res) {
                if (res.errors.length) {
                  return utils.notify(res.errors.map(function (err) {
                    return err.message
                  }).join('<br>')).error()
                } else {
                  self.Email.html = res.html
                  confs.storage.put(self.Email).then(function () {
                    utils.notify('Email has been saved.').success()
                    utils.trackEvent('Email', 'saved')
                    self.clonedEmail = JSON.parse(JSON.stringify(self.Email))
                    self.currentElement = {}
                  })
                }
              }, function (err) {
                return utils.notify(err).error()
              })
            },
            addSocialNetwork: function (links, selectedNetwork) {
              if (selectedNetwork) {
                links[selectedNetwork].active = true
              }
            },
            previewEmail: function () {
              if (!this.Email.elements.length) { return utils.notify('Nothing to preview, please add some elements.').log() }
              this.preview = true
              this.currentElement = {}
            },
            exportEmail: function () {
              if (!this.Email.elements.length) { return utils.notify('Nothing to export, please add some elements.').log() }

              let a = document.createElement('a')
              a.href = 'data:attachment/html,' + encodeURI(this.Email.html)
              a.target = '_blank'
              a.download = utils.uid('export') + '.html'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            },
            cloneElement: function (element) {
              let newEl = JSON.parse(JSON.stringify(element))
              newEl.id = utils.uid()
              this.Email.elements.splice(this.Email.elements.indexOf(element) + 1, 0, newEl)
            },
            cloneSectionElement: function (element, sectionIndex, columnIndex) {
              let newEl = JSON.parse(JSON.stringify(element))
              newEl.id = utils.uid()

              let elementsList = this.Email.elements[sectionIndex].options.columns[columnIndex].elements

              elementsList.splice(elementsList.indexOf(element) + 1, 0, newEl)
            },
            clone: function (obj) {
              let newElement = $.extend(true, {}, this.defaultOptions[obj.type])
              newElement.id = utils.uid()
              newElement.component = obj.type + 'Template'

              if (obj.type === 'section') {
                newElement.options.columns = []

                for (let i = 0; i < obj.columns; i++) {
                  newElement.options.columns.push({
                    elements: []
                  })
                }
              }

              return newElement
            },
            onMove: function () {
              tinymce.editors.forEach(function (editor) {
                return editor.hide()
              })
            },
            onMoveEnd: function () {
              tinymce.editors.forEach(function (editor) {
                return editor.show()
              })
            },
            getElementIds: function () {
              let elementids = this.Email.elements.map(x => {
                if (x.component === 'sectionTemplate') {
                  let ids = x.options.columns.map(x => x.elements.map(x => x.id))
                  ids = Array.prototype.concat(...ids)
                  ids.push(x.id)
                  return ids
                } else {
                  return x.id
                }
              })

              return Array.prototype.concat(...elementids)
            },
            onNewDragableElementClick: function () {
              this.lastElementIds = this.getElementIds()
            },
            onElementAdded: function () {
              let self = this

              let elementIds = this.getElementIds()

              let newElementId = elementIds.filter(x => { return self.lastElementIds.indexOf(x) < 0 })

              this.editElementWithId(newElementId[0])
            },
            importJson: function () {
              let self = this
              let file = $('<input />', {
                type: 'file',
                name: 'import-file'
              }).on('change', function () {
                let importedFile = new FileReader()
                importedFile.onload = function () {
                  let importedData = JSON.parse(importedFile.result)
                  if (utils.validateEmail(importedData)) {
                    confs.storage.put(importedData).then(function () {
                      self.currentElement = {}
                      self.Email = $.extend(true, {}, importedData)
                      self.clonedEmail = $.extend(true, {}, importedData)
                      utils.notify('Email has been imported').success()
                    })
                  } else {
                    utils.notify('Imported data isn\'t valid.').error()
                  }
                }
                let fileToImport = this.files[0]
                if (fileToImport.name.slice(-4) !== 'json') {
                  return utils.notify('Invalid format file').log()
                }
                importedFile.readAsText(fileToImport)
              })

              if (!self.Email.elements.length) { return file.click() }

              return utils.confirm('On import all current details will be deleted!', function () {
                return file.click()
              }, function () {
                return utils.notify('Import canceled').log()
              }, 'accept', 'deny')
            },
            exportJson: function () {
              let a = document.createElement('a')
              a.target = '_blank'
              a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(this.Email))
              a.download = utils.uid('export') + '.json'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            },
            setImageURL: function (URL) {
              this.currentElement.options.image = URL
            },
            selectImage: function () {
              API.onBrowseImages()
            },
            setProducts: function (products) {
              this.currentElement.options.products = products
            },
            selectProducts: function () {
              API.onBrowseProducts()
            }
          },
          template: data[0],
          directives: {
            mdInput: {
              bind: function (el, binding, vnode) {
                let $elem = $(el)
                let updateInput = function () {
                    // clear wrapper classes
                  $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled')

                  if ($elem.hasClass('md-input-danger')) {
                    $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                  }
                  if ($elem.hasClass('md-input-success')) {
                    $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                  }
                  if ($elem.prop('disabled')) {
                    $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                  }
                  if ($elem.hasClass('label-fixed')) {
                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                  }
                  if ($elem.val() != '') {
                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                  }
                }

                setTimeout(function () {
                  if (!$elem.hasClass('md-input-processed')) {
                    if ($elem.prev('label').length) {
                      $elem.prev('label').addBack().wrapAll('<div class="md-input-wrapper"/>')
                    } else {
                      $elem.wrap('<div class="md-input-wrapper"/>')
                    }
                    $elem
                      .addClass('md-input-processed')
                      .closest('.md-input-wrapper')
                      .append('<span class="md-input-bar"/>')
                  }

                  updateInput()
                }, 100)

                $elem
                  .on('focus', function () {
                    // $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                  })
                  .on('blur', function () {
                    setTimeout(function () {
                      $elem.closest('.md-input-wrapper').removeClass('md-input-focus')
                      if ($elem.val() == '') {
                        $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                      } else {
                        $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                      }
                    }, 100)
                  })
              }
            },
            inputFileUpload: {
              twoWay: true,
              bind: function (elem, binding, vnode) {
                let uploadLink = $(elem).find('button')
                let uploadingIcon = $(elem).find('.uploading')
                let imgPath = $(elem).find('.image-path')
                let imgPath_text = imgPath.text

                if (/uploads.im/.test(confs.options.urlToUploadImage) && location.protocol === 'https:') {
                  console.error('Sorry, but uploads.im don\'t support https!')
                  return
                }

                setTimeout(function () {
                  let uploadInput = $('<input/>', {
                    type: 'file',
                    name: 'file'
                  }).bind('change', function (event) {
                    if (!confs.options.urlToUploadImage) { throw Error('You don\'t set the \'urlToUploadImage\' in variables.') }

                    let inputFile = $(event.target)
                    inputFile.prop('disabled', true)

                    imgPath_text = imgPath[0].value
                    imgPath.text('Uploading')

                    uploadingIcon.addClass('active')
                    let formData = new FormData()
                    formData.append('upload', event.target.files[0])
                    return $.ajax({
                      url: confs.options.urlToUploadImage,
                      data: formData,
                      processData: false,
                      contentType: false,
                      type: 'POST',
                      success: function (res) {
                        if (res.status_code == 200) {
                          let customEvent = new Event('input', {
                            bubbles: true
                          }) // won't work in IE <11
                          $(elem).find('input.image-path').val(res.data.img_url)
                          $(elem).find('input.image-path').get(0).dispatchEvent(customEvent)
                          utils.notify('Your image has been uploaded').log()
                        } else {
                          utils.notify(res.status_txt).error()
                        }
                      },
                      error: function (err) {
                        utils.notify(err.statusText).error()
                      },
                      complete: function () {
                        inputFile.prop('disabled', false)
                        imgPath.text(imgPath_text)
                        uploadingIcon.removeClass('active')
                      }
                    })
                  })

                  uploadLink.on('click', (e) => {
                    e.preventDefault()

                    if (/uploads.im/.test(confs.options.urlToUploadImage) && location.protocol == 'https:') {
                      imgPath.text(imgPath_text)
                      return utils.notify('Sorry, but uploads.im don\'t support https!').error()
                    } else {
                      return uploadInput.click()
                    }
                  })
                }, 100)
              },
              unbind: function (elem) {
                $(elem).unbind('change')
              }
            }
          },
          filters: {
            makeTitle: function (value) {
              if (!value) return ''
              value = utils.camelToSnake(value)
              value = value.charAt(0).toUpperCase() + value.slice(1)
              return value.replace(/_/g, ' ')
            },
            capitalize: function (value) {
              if (!value) return ''
              return value.charAt(0).toUpperCase() + value.slice(1)
            }
          },
          components: {
            colorPicker: {
              props: ['color'],
              template: `
                <div class="color-input-container">
                    <div class="current-color" color-picker @click="openColorPicker" :style="{ backgroundColor: color }"></div>
                    <input class="input" v-md-input id="elementBackgroundColor" type="text" @input="update()" v-model="color" />
                    <input type="color" ref="inputColor" @input="update()" style="display: none; visibility: hidden" v-model="color" />
                </div>
              `,
              methods: {
                update () {
                  this.$emit('update:color', this.color)
                },
                openColorPicker () {
                  $(this.$refs.inputColor).trigger('click')
                }
              }
            },
            buttonTemplate: {
              props: ['element'],
              template: '' +
                '<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" align="center" style="display: table;" data-type="button">' +
                  '<tbody>' +
                    '<tr>' +
                      '<td :style="{paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}">' +
                        '<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" :style="{ textAlign: element.options.align }">' +
                          '<tbody>' +
                            '<tr>' +
                              '<td class="button" :style="{ backgroundColor: element.options.backgroundColor, paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`}">' +
                                '<a :style="{backgroundColor: element.options.buttonBackgroundColor, color: element.options.font.color, fontFamily: element.options.font.family, fontSize: element.options.font.size + \'px\', lineHeight: \'19px\', display: element.options.fullWidth === \'true\' ? \'block\' : \'inline-block\', borderRadius: element.options.border.radius + \'px\', border: `${element.options.border.size}px ${element.options.border.style}  ${element.options.border.color}`, textAlign: \'center\',  textDecoration: \'none\', fontWeight: element.options.font.weight, fontStyle: element.options.font.italic, margin: 0, width: \'auto\', paddingTop: `${this.element.options.innerPadding[0]}px`, paddingRight: `${this.element.options.innerPadding[1]}px`, paddingBottom: `${this.element.options.innerPadding[2]}px`, paddingLeft: `${this.element.options.innerPadding[3]}px`}" class="button-1" :href="element.options.linkTo.link" data-default="1">' +
                                  '{{ element.options.buttonText }}' +
                                '</a> <!--[if mso]></center></v:roundrect><![endif]-->' +
                              '</td>' +
                            '</tr>' +
                          '</tbody>' +
                        '</table>' +
                      '</td>' +
                    '</tr>' +
                  '</tbody>' +
                '</table>'
            },
            textTemplate: {
              props: ['element'],
              computed: {
                lineHeight: function () {
                  var lineHeight = 0
                  var fontSize = this.element.options.font.size

                  switch (this.element.options.lineHeight) {
                    case 's1':
                      lineHeight = fontSize
                      break

                    default:
                    case 's2':
                      lineHeight = fontSize * 1.25
                      break

                    case 's3':
                      lineHeight = fontSize * 1.5
                      break

                    case 's4':
                      lineHeight = fontSize * 2
                      break
                  }
                  return lineHeight
                }
              },
              template: '' +
              '<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" style="display: table;" align="center" data-type="text-block">' +
                '<tbody>' +
                  '<tr>' +
                    // '<td :style="{paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}">' +
                    '<td>' +
                      '<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%">' +
                        '<tbody>' +
                          '<tr>' +
                            '<td class="block-text" data-block-id="background" align="left" :style="{ backgroundColor: element.options.backgroundColor, paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`, fontFamily: this.element.options.font.family, fontSize: `${this.element.options.font.size}px`, lineHeight: `${lineHeight}px`}" style=" color: #000000;">' +
                              '<tinymce v-model="element.options.text"/>' +
                            '</td>' +
                          '</tr>' +
                        '</tbody>' +
                      '</table>' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            htmlTemplate: {
              props: ['element'],
              template: '' +
              '<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" align="center" data-type="html-block">' +
                '<tbody>' +
                  '<tr>' +
                    '<td class="block-text" data-block-id="background" align="left" v-html="element.options.html">' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            socialTemplate: {
              props: ['element'],
              template: '' +
              '<table width="100%" class="main" align="center" cellspacing="0" cellpadding="0" border="0"  style="display: table;" data-type="social-links">' +
                '<tbody>' +
                  '<tr>' +
                    '<td :style="{ paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}">' +
                      '<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%">' +
                        '<tbody>' +
                          '<tr>' +
                            '<td class="social" :align="this.element.options.align" :style="{ backgroundColor: this.element.options.backgroundColor, paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`}">' +
                              '<a :href="element.options.links.facebook.link" v-if="element.options.links.facebook.active" target="_blank" style="border: none;text-decoration: none;" class="facebook">' +
                                '<img :width="element.options.iconSize" border="0" src="' + location.origin + '/assets/social/facebook.png">' +
                              '</a>' +
                              '<a :href="element.options.links.twitter.link" v-if="element.options.links.twitter.active" target="_blank" style="border: none;text-decoration: none;" class="twitter">' +
                                '<img :width="element.options.iconSize" border="0" src="' + location.origin + '/assets/social/twitter.png">' +
                              '</a>' +
                              '<a :href="element.options.links.linkedin.link" v-if="element.options.links.linkedin.active" target="_blank" style="border: none;text-decoration: none;" class="linkedin">' +
                                '<img :width="element.options.iconSize" border="0" src="' + location.origin + '/assets/social/linkedin.png">' +
                              '</a>' +
                              '<a :href="element.options.links.youtube.link"  v-if="element.options.links.youtube.active" target="_blank" style="border: none;text-decoration: none;" class="youtube">' +
                                '<img :width="element.options.iconSize" border="0" src="' + location.origin + '/assets/social/youtube.png">' +
                              '</a>' +
                            '</td>' +
                          '</tr>' +
                        '</tbody>' +
                      '</table>' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            unsubscribeTemplate: {
              props: ['element'],
              template: '' +
              '<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" :style="{backgroundColor: element.options.backgroundColor, marginTop: `${element.options.margin[0]}px`, marginBottom: `${element.options.margin[2]}px`, marginLeft: `${element.options.margin[3]}px`, marginRight: `${element.options.margin[1]}px`}" style="display: table;" align="center" data-type="text-block">' +
                '<tbody>' +
                  '<tr>' +
                    '<td data-block-id="background" align="left" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[3], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3], fontFamily: element.options.font.family, fontWeight: element.options.font.weight, margin: 0,color: element.options.color }" style="font-family: Arial,serif; font-size: 13px; color: #000000; line-height: 22px;">' +
                      '<tinymce v-model="element.options.text"/>' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            dividerTemplate: {
              props: ['element'],
              template: '' +
              '<table width="100%" class="main" cellspacing="0" cellpadding="0" style="border: 0; display: table;" border="0" align="center" data-type="divider">' +
                '<tbody>' +
                  '<tr>' +
                    '<td :style="{paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}">' +
                      '<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%">' +
                        '<tbody>' +
                          '<tr>' +
                            '<td class="divider-simple" :style="{ backgroundColor: element.options.backgroundColor, paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`}">' +
                              '<table width="100%" cellspacing="0" cellpadding="0" border="0" :style="{borderTop: `${element.options.border.size}px ${element.options.border.style} ${element.options.border.color}`}">' +
                                '<tbody>' +
                                  '<tr>' +
                                    '<td width="100%"/>' +
                                  '</tr>' +
                                '</tbody>' +
                              '</table>' +
                            '</td>' +
                          '</tr>' +
                        '</tbody>' +
                      '</table>' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            imageTemplate: {
              props: ['element'],
              template: '' +
              '<table width="100%" class="main"  cellspacing="0" cellpadding="0" border="0" align="center" :style="{backgroundColor: element.options.backgroundColor, marginTop: `${element.options.margin[0]}px`, marginBottom: `${element.options.margin[2]}px`, marginLeft: `${element.options.margin[3]}px`, marginRight: `${element.options.margin[1]}px`}" style="display: table;" data-type="image">' +
                '<tbody>' +
                  '<tr>' +
                    '<td :align="element.options.align" :style="{paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`}" class="image">' +
                      '<img border="0" :alt="element.options.altTag" style="display:block;max-width:100%;" :style="{width: `${element.options.width}px` }" :src="element.options.image" tabindex="0">' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            videoTemplate: {
              props: ['element'],
              computed: {
                iframeCode: function () {
                  let width = this.element.options.fullWidth === 'true' ? '100%' : this.element.options.width
                  let iFrame = '<iframe width=' + width + ' height=' + this.element.options.height + ' src=' + this.element.options.url + " frameborder='0' allowfullscreen></iframe>"
                  return iFrame
                }
              },
              template: '' +
              '<table width="100%" class="main"  cellspacing="0" cellpadding="0" border="0" align="center" style="display: table;" data-type="image">' +
                '<tbody>' +
                  '<tr>' +
                    '<td :style="{ paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}">' +
                      '<table width="100%" class="main"  cellspacing="0" cellpadding="0" border="0" align="center">' +
                        '<tbody>' +
                          '<tr>' +
                            '<td :style="{ backgroundColor: element.options.backgroundColor, paddingTop: `${this.element.options.padding[0]}px`, paddingRight: `${this.element.options.padding[1]}px`, paddingBottom: `${this.element.options.padding[2]}px`, paddingLeft: `${this.element.options.padding[3]}px`, lineHeight: 0, textAlign: element.options.align}" class="video" :class="{fullWidth: element.options.fullWidth === \'true\'}" v-html="iframeCode">' +
                            '</td>' +
                          '</tr>' +
                        '</tbody>' +
                      '</table>' +
                    '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>'
            },
            productsTemplate: {
              props: ['element', 'emailScreenMode'],
              computed: {
                productGrid: function () {
                  let columns = this.element.options.columns
                  let rows = this.element.options.rows

                  let productGrid = '<table style="width: 100%">'

                  let placeholder = {
                    name: 'placeholder',
                    image: 'assets/154x160.jpg',
                    price: '$999',
                    buttonText: 'Buy now!',
                    buttonColor: '#00abee',
                    buyURL: '/placeholder.url'
                  }

                  let activeProductBorder = 'border: 1px solid #00aeff'

                  let isPopulatingFromSource = this.element.options.populateFromSource.isActive
                  let nProductsFromCatalog = this.element.options.products.length - 1

                  let product = {}

                  for (let row = 0; row < rows; row++) {
                    productGrid += '<tr>'
                    for (let column = 0; column < columns; column++) {
                      let n = row * columns + column

                      if (isPopulatingFromSource) {
                        product = placeholder
                      } else {
                        product = this.element.options.products[n]

                        if (n > nProductsFromCatalog) break
                      }

                      let activeProductBorder = (product.id === this.element.options.activeProduct) ? 'border: 0px solid #00aeff' : ''
                      let columnWidth = 100 / columns

                      productGrid += '<td'

                      if (this.emailScreenMode === 'desktop') productGrid += ' class="productGridDesktop"'
                      if (this.emailScreenMode === 'mobile') productGrid += ' class="productGridMobile"'

                      productGrid += ' style="vertical-align:bottom; width:' + columnWidth + '%;"><div style="box-sizing: border-box; padding:2px; text-align: center; width: 100%; ' + activeProductBorder + '">'
                      productGrid += '<div style="box-sizing: border-box;"><img style="max-width: 100%" src="' + product.image + '"></div>'
                      productGrid += '<div style="margin-bottom:20px;">'
                      productGrid += this.element.options.showProductName === 'true' ? '<h1 style="font-size: 20px; font-weight: bold; padding: 4px; margin: 0; margin-top: 8px;">' + product.name + '</h1>' : ''
                      productGrid += this.element.options.showProductPrice === 'true' ? '<h2 style="padding: 8px; margin-bottom: 8px; font-size: 16px; margin-top: 0px;">' + product.price + '</h2>' : ''
                      productGrid += this.element.options.showProductButton === 'true' ? '<a href="' + product.buyURL + '" style="display: inline-block; text-decoration: none; padding: 12px 20px; background-color: ' + product.buttonColor + '; border: 0; border-radius: 2px; font-weight: bold; color: #fff;">' + product.buttonText + '</a>' : ''
                      productGrid += '</div></div></td>'
                    }
                    productGrid += '</tr>'
                  }
                  productGrid += '</table>'

                  let width = this.element.options.fullWidth ? '100%' : this.element.options.width

                  return productGrid
                }
              },
              template: '' +
              '<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="display: table;" data-type="image">' +
                '<tbody>' +
                  '<template>' +
                    '<tr>' +
                      '<td style="padding: 4px;" :style="{ paddingTop: `${element.options.margin[0]}px`, paddingBottom: `${element.options.margin[2]}px`, paddingLeft: `${element.options.margin[3]}px`, paddingRight: `${element.options.margin[1]}px`}" :class="{fullWidth: element.options.fullWidth}">' +
                        '<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">' +
                          '<tbody>' +
                            '<tr>' +
                              '<td :style="{backgroundColor: element.options.backgroundColor, paddingTop: `${element.options.padding[0]}px`, paddingBottom: `${element.options.padding[2]}px`, paddingLeft: `${element.options.padding[3]}px`, paddingRight: `${element.options.padding[1]}px`}" v-html="productGrid"/>' +
                            '</tr>' +
                          '</tbody>' +
                        '</table>' +
                      '</td>' +
                    '</tr>' +
                  '</template>' +
                '</tbody>' +
              '</table>'
            }
          }
        })
      }, reject)
    },
    'loading': {
      template: '<transition name="fade"><h1 class="loading" v-if="loading">Loading ...</h1></transition>',
      computed: {
        loading: function () {
          return this.$root._data.loading
        }
      }
    }
  }
}).$mount('#app')

Vue.directive('tinymceEditor', {
  twoWay: true,
  bind: function (elem, binding, obj) {
    let self = elem,
      textarea = []
    tinymce.baseURL = 'bower_components/tinymce'
    setTimeout(function () {
      tinymce.init({
        target: self,
        inline: true,
        skin: 'lightgray',
        theme: 'modern',
        plugins: ['advlist autolink lists link image charmap', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table contextmenu paste', 'textcolor'],
        toolbar: 'bold italic forecolor alignleft aligncenter alignright alignjustify link',
        fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 24pt 36pt',
        setup: function (editor) {
           // init tinymce
          editor.on('init', function () {
            textarea = $(elem).next('textarea')
            editor.setContent(binding.value)
          })

           // when typing keyup event
          editor.on('keyup change', function () {
            // get new value
            textarea.val(editor.getContent({
              format: 'raw'
            }))

            let customEvent = new Event('input', {
              bubbles: true
            }) // won't work in IE <11
            textarea.get(0).dispatchEvent(customEvent)
          })
        }
      })
    }, 0)
  },
  update: function (el, obj) {
    let currentEditor = tinymce.get($(el).attr('id'))
    if (obj.modifiers.update) {
      currentEditor.setContent(obj.value)
    }
  },
  unbind: function (el) {
    tinymce.get($(el).attr('id')).destroy()
  }
})

Vue.component('tinymce', {
  template: '<content ref="editor"><div v-html="value"></div></content>',
  name: 'tiny-mce',
  props: ['value'],
  mounted () {
    tinymce.baseURL = 'bower_components/tinymce'
    tinymce.init({
      target: this.$refs.editor,
      inline: true,
      skin: 'lightgray',
      theme: 'modern',
      plugins: ['autolink link', 'paste', 'textcolor'],
      toolbar: 'bold italic forecolor alignleft aligncenter alignright alignjustify link variables',
      menubar: false,
      fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 24pt 36pt',

      setup: function (editor) {
        editor.addButton('variables', {
          type: 'menubutton',
          text: 'Variables',
          icon: false,
          menu: [{
            text: 'var 1',
            onclick: function () {
              editor.insertContent(' -## var 1 ##- ')
            }
          }, {
            text: 'var 2',
            onclick: function () {
              editor.insertContent(' -## var 2 ##- ')
            }
          }]
        })
      },

      init_instance_callback: (editor) => {
        editor.on('keyup change', (e) => {
          let parsedContent = editor.getContent({ format: 'raw' })

          if (parsedContent.slice(0, 5) !== '<div>') {
            parsedContent = parsedContent.replace('<br data-mce-bogus="1">', '')
            parsedContent = parsedContent.replace('<br>', '')
            parsedContent = '<div>' + parsedContent + '</div>'
            editor.setContent(parsedContent)
          }

          this.$emit('input', parsedContent)
        })
      }
    })
  },
  destroyed () {
    tinymce.get(this.$refs.editor.id).destroy()
  }
})

// Prevent jQuery UI dialog from blocking focusin
$(document).on('focusin', function (e) {
  if ($(e.target).closest('.mce-window, .moxman-window').length) {
    e.stopImmediatePropagation()
  }
})

const API = {}

/**
 * Returns the JSON representation of the current Email
 *
 * @returns {JSON}
 */
API.getJSON = () => {
  let email = Object.assign({}, emailBuilder.$children[0].Email)
  email.html = ''
  return email // JSON.stringify(email)
}

/**
 * Loads a JSON representation of an Email into the system
 *
 * @param {JSON} json
 * @returns {undefined}
 */
API.loadJSON = json => {
  emailBuilder.$children[0].Email = JSON.parse(json)
},

/**
 * Returns the MJML-JSON representation of the current Email
 *
 * @returns {JSON}
 */
API.getMJML = () => {
  return utils.compileMJML(emailBuilder.$children[0].Email)
},

/**
 * Called when a user presses the select image button from the settings of an image element
 *
 * @returns {undefined}
 */
API.onBrowseImages = () => {
  console.log('open modal')

  // Open Modal to Select Image
  // ...
},

/**
 * Stores the passed imgURL as the selected img on the active img object
 *
 * @param {String} imgURL
 * @returns {undefined}
 */
API.selectImage = (imgURL) => {
  emailBuilder.$children[0].setImageURL(imgURL)
},

/**
 * Called when a user presses the products browse button from the settings of a products element
 *
 * @returns {undefined}
 */
API.onBrowseProducts = () => {
  console.log('open modal')

    // Open Modal to Select Products
    // ...
},

/**
 * Stores the passed products Array on the active products object
 *
 * @param {Array} productsArray
 * @returns {undefined}
 */
API.selectProducts = (productsArray) => {
  emailBuilder.$children[0].setProducts(productsArray)
}
