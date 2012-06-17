// This file was automatically generated from email-required.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.emailRequired = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  soy.layout({body: '<h1>' + ((! opt_data.email || ! opt_data.emailConfirmed) ? soy.$$escapeHtml(opt_data.appName) + ' needs your email' : 'All good!') + '</h1><p>' + ((! opt_data.email) ? 'To use ' + soy.$$escapeHtml(opt_data.appName) + ', you need to provide us with an email address. You can do this in your <a href="/profile">profile</a>.' : (! opt_data.emailConfirmed) ? 'Your email address ' + soy.$$escapeHtml(opt_data.email) + ' hasn\'t been verified, and ' + soy.$$escapeHtml(opt_data.appName) + ' won\'t work without it. Need us to <a id="resend_verification" href="#">send another verification email</a>?' : 'You have a valid email address (' + soy.$$escapeHtml(opt_data.email) + ') on file. Head on over to <a href="' + soy.$$escapeHtml(opt_data.appUrl) + '">' + soy.$$escapeHtml(opt_data.appName) + '</a>.') + '<p>', bottomHtml: '\n            <script>\n                var sending = false;\n                $(\'#resend_verification\').click(function(e) {\n                    e.preventDefault();\n\n                    if (sending) {\n                        return;\n                    }\n                    sending = true;\n\n                    var status = $(\'<p>Sending...</p>\');\n                    $(\'#main\').append(status)\n\n                    Mailer.sendVerification().done(function() {\n                        status.text(\'Sent.\').delay(1000).fadeOut(\'fast\', function() {\n                            status.remove();\n                            sending = false;\n                        });\n                    }).fail(function() {\n                        status.text(\'Could not send email.\').delay(1000).fadeOut(\'fast\', function() {\n                            status.remove();\n                            sending = false;\n                        });\n                    });\n                });\n            </script>\n            '}, output, opt_ijData);
  return opt_sb ? '' : output.toString();
};
