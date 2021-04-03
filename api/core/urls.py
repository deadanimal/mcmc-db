from datetime import datetime, timedelta

from django.conf import settings
from django.conf.urls import include, url
from django.contrib.gis import admin

from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from users.views import (
    MyTokenObtainPairView
)

class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass

router = NestedDefaultRouter()

# Organisations app

from organisations.views import (
    OrganisationViewSet
)

organisations_router = router.register(
    'organisations', OrganisationViewSet
)

# Users app

from users.views import (
    CustomUserViewSet
)

users_router = router.register(
    'users', CustomUserViewSet
)

from ViewListingVariable.views import (
    ViewListingVariableViewSet
)

ViewListingVariable_router = router.register(
    'ViewListingVariable', ViewListingVariableViewSet
)

from ViewListingVariable2.views import (
    ViewListingVariable2ViewSet
)

ViewListingVariable2_router = router.register(
    'ViewListingVariable2', ViewListingVariable2ViewSet
)

from ProductRegistration.views import (
    ProductRegistrationViewSet
)

ProductRegistration_router = router.register(
    'ProductRegistration', ProductRegistrationViewSet
)

from dataSearch.views import (
    dataSearchViewSet
)

dataSearch_router = router.register(
    'dataSearch', dataSearchViewSet
)

from masterTable.views import (
    masterTableViewSet
)

masterTable_router = router.register(
    'masterTable', masterTableViewSet
)

from FAQ.views import (
    FAQViewSet
)

FAQ_router = router.register(
    'FAQ', FAQViewSet
)

from FAQCategory.views import (
    FAQCategoryViewSet
)

FAQCategory_router = router.register(
    'FAQCategory', FAQCategoryViewSet
)

from FAQTitle.views import (
    FAQTitleViewSet
)

FAQTitle_router = router.register(
    'FAQTitle', FAQTitleViewSet
)

from emailNoti.views import (
    emailNotiViewSet
)

emailNoti_router = router.register(
    'emailNoti', emailNotiViewSet
)

from emailTemplate.views import (
    emailTemplateViewSet
)

emailTemplate_router = router.register(
    'emailTemplate', emailTemplateViewSet
)

from certifiedAgency.views import (
    certifiedAgencyViewSet
)

certifiedAgency_router = router.register(
    'certifiedAgency', certifiedAgencyViewSet
)

from variableConfigure.views import (
    variableConfigureViewSet
)

variableConfigure_router = router.register(
    'variableConfigure', variableConfigureViewSet
)

from productCertification.views import (
    productCertificationViewSet
)

productCertification_router = router.register(
    'productCertification', productCertificationViewSet
)

from SLP.views import (
    SLPViewSet
)

SLP_router = router.register(
    'SLP', SLPViewSet
)

from SearchCounter.views import (
    SearchCounterViewSet
)

SearchCounter_router = router.register(
    'SearchCounter', SearchCounterViewSet
)

from VisitorCounter.views import (
    VisitorCounterViewSet
)

VisitorCounter_router = router.register(
    'VisitorCounter', VisitorCounterViewSet
)

urlpatterns = [
    url(r'v1/', include(router.urls)),
    url(r'auth/', include('rest_auth.urls')),
    url(r'auth/registration/', include('rest_auth.registration.urls')),

    # url(r'^', include('table.urls')),
    # url(r'^api/table$', views.table_list),

    url('auth/obtain/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    url('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    url('auth/verify/', TokenVerifyView.as_view(), name='token_verify')
]