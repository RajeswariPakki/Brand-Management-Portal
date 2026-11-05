using CRUDOperations.Migrations;
using CRUDOperations.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CRUDOperations.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BrandController : ControllerBase
    {
        private readonly BrandContext _dbContext;
        public BrandController(BrandContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            if(_dbContext == null)
            {
                return NotFound();
            }
            return await _dbContext.Brands.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            if (_dbContext == null)
            {
                return NotFound();
            }
            var brand = await _dbContext.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound();
            } 
            return brand;

        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand(Brand brand)
        {
            brand.CreatedDate = DateTime.UtcNow;

            _dbContext.Brands.Add(brand);

            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
            nameof(GetBrand),
            new { id = brand.ID },
            brand
            );
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, Brand brand)
        {
            //Check to match the url id & the request id. This match doesn't guarantee for the brand existence.
            if (id != brand.ID)
            {
                return BadRequest();
            }
            brand.ModifiedDate = DateTime.UtcNow;
            _dbContext.Entry(brand).State = EntityState.Modified;
            try
            {
                await _dbContext.SaveChangesAsync();
            }

            //Concurrency Exception:
            // Even though id's match, the brand may not be available & no row in the DB gets updated.
            // Real-time scenario: Before saving any changes to the brand, there might be a possibility that the same brand may get updated by another user.
            catch (DbUpdateConcurrencyException)
            {
                if(!BrandAvailable(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok();
        }
        //Helper function: To check for the brand availability.
        private bool BrandAvailable(int id)
        {
            return (_dbContext.Brands?.Any(b => b.ID == id)).GetValueOrDefault();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            if(_dbContext.Brands == null)
            {
                return NotFound();
            }
            var brand = await _dbContext.Brands.FindAsync(id);
            if(brand == null)
            {
                return NotFound();
            }
            _dbContext.Brands.Remove(brand);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }
    }
}