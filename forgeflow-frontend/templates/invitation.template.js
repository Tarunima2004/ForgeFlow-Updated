function invitationTemplate({

  name,

  role,

  invitedBy,

  invitationLink,

}) {

  const roleTitle =
    role === "admin"
      ? "Administrator"
      : "Member";

  return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>ForgeFlow Invitation</title>

</head>

<body
style="
margin:0;
padding:40px;
background:#f5f7fb;
font-family:Arial,sans-serif;
">

<div
style="
max-width:650px;
margin:auto;
background:white;
border-radius:10px;
padding:40px;
box-shadow:0 2px 10px rgba(0,0,0,.08);
">

<h1
style="
color:#2036bd;
margin-bottom:10px;
">
ForgeFlow
</h1>

<p>

Hi <strong>${name}</strong>,

</p>

<p>

<strong>${invitedBy}</strong>

has invited you to join

<strong>ForgeFlow</strong>

as an

<strong>${roleTitle}</strong>.

</p>

<p>

Click the button below to accept your invitation.

</p>

<p
style="
margin:35px 0;
">

<a
href="${invitationLink}"
style="
background:#2036bd;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
">

Accept Invitation

</a>

</p>

<p>

This invitation expires in

<strong>7 days</strong>.

</p>

<hr>

<p
style="
font-size:13px;
color:#777;
">

If you weren't expecting this invitation,
you can safely ignore this email.

</p>

</div>

</body>

</html>

`;

}

module.exports = {

  invitationTemplate,

};