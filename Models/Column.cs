using System;
using System.Dynamic;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tazkr.Models
{
    public class Column : BaseEntity
    {
        /// <summary>
        /// Order that this column appears on the board
        /// </summary>
        public int Index { get; set; }
        public string Title { get; set; }
        public string BoardId { get; set; }
        public Board Board { get; set; }
        public List<Card> Cards { get; set; }
        public override dynamic GetServerResponsePayload(ApplicationUser user)
        {
            dynamic obj = new ExpandoObject();
            obj.Id = this.Id;
            obj.UpdateHashCode = this.UpdateHashCode;
            obj.Index = this.Index;
            obj.Title = this.Title;
            obj.Cards = this.Cards == null ? new List<Object>() : this.Cards.Select(x => x.GetServerResponsePayload(user)).ToList();
            return obj;
        }
    }
}
