using Microsoft.AspNetCore.Mvc;
using server.Services;
using WebApi.Models.Currency;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CurrencyController : ControllerBase
    {
        private ICurrencyService _currencyService;
        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _currencyService.GetAll();
            return Ok(users);
        }

        [HttpGet]
        [Route("{code}")]
        public IActionResult GetByCode(string code)
        {
            var user = _currencyService.GetByCode(code);
            return Ok(user);
        }

        [HttpGet]
        [Route("/prices")]
        public IActionResult GetPriceChanges([FromQuery] GetPricesRequest model)
        {
            var result = _currencyService.GetPriceChanges(model);
            return Ok(result);
        }
    }
}
