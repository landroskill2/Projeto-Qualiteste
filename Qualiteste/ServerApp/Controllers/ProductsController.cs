﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qualiteste.ServerApp.Dtos;
using Qualiteste.ServerApp.Services;
using Qualiteste.ServerApp.Services.Errors;
using Qualiteste.ServerApp.Utils;

namespace Qualiteste.ServerApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ProductOutputModel>))]
        [ProducesResponseType(500)]
        public IActionResult GetAllProducts([FromQuery] string? brandName) {
            try
            {
                Either<CustomError, IEnumerable<ProductOutputModel>> result = _productService.GetAllProducts(brandName);

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );

            }
            catch (Exception e)
            {

                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }


        [Authorize(Roles = "ADMIN")]
        [HttpGet("brands")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<string>))]
        [ProducesResponseType(500)]
        public IActionResult GetAllDistinctBrands() {
           try
           {
                Either<CustomError, BrandOutputModel> result = _productService.GetAllBrands();

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    success => Ok(success)
                );

            }
            catch (Exception e)
            {

                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        [ProducesResponseType(201)]
        public IActionResult CreateNewProduct([FromBody] ProductInputModel product)
        {
            try
            {
                Either<CustomError, string> result = _productService.CreateNewProduct(product);
                var actionName = product.Ref;

                return result.Match(
                    error => Problem(statusCode: error.StatusCode, title: error.Message),
                    //TODO
                    success => CreatedAtRoute(null, success)
                );

            }
            catch (Exception e)
            {

                return Problem(statusCode: 500, title: "Ocorreu um erro inesperado");
            }
        }
    }
}
